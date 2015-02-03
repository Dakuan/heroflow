var R = require('ramda'),
    request = require('request'),
    Q = require('q'),
    githubUrl = require('../util/github-url'),
    createHerokuApp = require('../commands/create-heroku-app'),
    storePullRequest = require('../commands/store-pull-request'),
    destroyPullRequest = require('../commands/destroy-pull-request'),
    destroyHerokuApp = require('../commands/destroy-heroku-app'),
    buildHerokuApp = require('../commands/build-heroku-app'),
    releaseHerokuApp = require('../commands/release-heroku-app'),
    findPullRequest = require('../queries/find-pull-request'),
    getAppConfig = require('../queries/get-app-config'),
    setAppConfig = require('../commands/set-app-config'),
    CONFIG = require('../config/config');

var isOpened = R.propEq('action', 'opened');
var isClosed = R.propEq('action', 'closed');
var isSynchronize = R.propEq('action', 'synchronize');


var onError = R.curry(function(res, err) {
    console.log(err);
    console.log(err.stack);
    res.send(500);
    res.end();
});

var onOpened = R.curry(function(res, body) {
    var branchName = body.pull_request.head.ref;
    console.log('pull request opened!');
    console.log('creating app for branch name: ' + body.pull_request.head.label);
    Q.all([
        getAppConfig('quill-nabu-dev'),
        createHerokuApp(branchName)
    ]).then(function(data) {
        var fromConfig = data[0],
            toApp = data[1];
        Q.all([
            storePullRequest({
                pull_request: body.pull_request,
                heroku_app: toApp
            }),
            setAppConfig(toApp.name, fromConfig)
        ]).then(function() {
            var url = githubUrl(body.pull_request.user.login,
                body.repository.name,
                branchName);
            console.log('building ' + url);
            return buildHerokuApp(toApp.name, url);
        }).then(function(build) {
            return releaseHerokuApp(toApp.name, build.slug.id)
        }).then(function() {
            res.status(200);
            res.send('created app!');
        }, onError(res)).done();
    }, onError(res)).done();
});

var onClosed = R.curry(function(res, body) {
    console.log('pull request closed!');
    var id = body.pull_request.id;
    findPullRequest(id).then(function(pr) {
        return Q.all([
            destroyHerokuApp(pr.heroku_app.name),
            destroyPullRequest(id)
        ]);
    }).then(function() {
        res.status(204);
        res.send('deleted');
    }, onError(res)).done();
});

var onSync = R.curry(function(res, body) {
    console.log('pull request sync!');
    var branchName = body.pull_request.head.ref;
    var id = body.pull_request.id;
    console.log('look for ' + id);
    findPullRequest(id)
        .then(function(pr) {
            var next;

            var cr = createHerokuApp(branchName).then(function(app) {
                return storePullRequest({
                    pull_request: body.pull_request,
                    heroku_app: app
                });
            });
            var next = R.ifElse(
                R.I,
                R.always(Q.fcall(R.always(pr))),
                R.always(cr)
            );
            // if (pr) {
            //     next = Q.fcall(function() {
            //         return pr
            //     });
            // } else {
            //     next = createHerokuApp(branchName)
            //         .then(function(app) {
            //             return storePullRequest({
            //                 pull_request: body.pull_request,
            //                 heroku_app: app
            //             });
            //         });
            // }
            next(pr).then(function(pr) {
                console.log('found');
                var url = githubUrl(pr.pull_request.user.login, body.repository.name, body.pull_request.head.sha);
                console.log('building ' + url);
                var toApp = pr.heroku_app.name;
                console.log('deploy to ' + toApp);
                buildHerokuApp(toApp, url)
                    .then(function(build) {
                        return releaseHerokuApp(toApp, build.slug.id);
                    }).then(function() {
                        res.status(201);
                        res.send('updated app!');
                    }, onError(res))
                    .done()
            }, onError(res)).done();
        });
});

module.exports = function(res) {
    console.log('event is a pull request');
    return R.cond(
        [isOpened, onOpened(res)], [isClosed, onClosed(res)], [isSynchronize, onSync(res)], [R.T, function(body) {
            console.log('fell through');
            console.log(body);
            console.log(body.action);
        }]
    );
};
