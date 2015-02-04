var express = require('express'),
    bodyParser = require('body-parser'),
    onPullRequest = require('./event-handlers/pull-request-handler'),
    getPullRequests = require('./queries/get-pull-requests-list'),
    R = require('ramda'),
    markdown = require('markdown').markdown,
    app = express();


// view engine
app.locals._md = markdown;
app.set('views', 'src/views/');
app.set('view engine', 'jade');

app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    getPullRequests().then(function(prs) {
        res.render('index', {
            apps: prs,
            route: 'features'
        });
    }).catch(function(e) {
        next(e);
    });
});

app.get('/about', function(req, res, next) {
    res.render('about', {
        route: 'about'
    });
});


function through(res) {
    return function() {
        res.send('no matching handler found, not the end of the world');
    }
}

app.post('/github', function(req, res, next) {
    console.log('post commit hook triggered');
    var isPullRequest = R.has('pull_request');
    console.log(req.body.action);
    var handleEvent = R.cond(
        [isPullRequest, onPullRequest(res)], [R.T, through(res)]
    );
    handleEvent(req.body);
});

module.exports = app;
