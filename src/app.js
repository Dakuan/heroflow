var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('cookie-session'),
    onPullRequest = require('./event-handlers/pull-request-handler'),
    getPullRequests = require('./queries/get-pull-requests-list'),
    findMyRepos = require('./queries/find-my-repos'),
    findRepo = require('./queries/find-repo'),
    findAllProjects = require('./queries/find-all-projects'),
    storeProject = require('./commands/store-project'),
    createCommitHook = require('./commands/create-commit-hook'),
    R = require('ramda'),
    passport = require('passport'),
    markdown = require('markdown').markdown,
    path = require('path'),
    Q = require('q'),
    app = express();

// view engine
app.locals._md = markdown;
app.set('views', 'src/views/');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(session({
    secret: 'blah'
}));

// static
app.use('/public/css', express.static(path.join(__dirname, '../build/css')));
app.use('/public/images', express.static(path.join(__dirname, '../assets/images')));

// Login
require('./auth/auth')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res, next) {
    res.render('index');
});

function hasUser(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

app.get('/projects/add', hasUser, function(req, res, next) {

    Q.all([
        findMyRepos(req.user.githubToken.accessToken),
        findAllProjects()
    ]).then(function(data) {

        var myProjects = data[0],
            trackedProjects = data[1];

        var projects = R.reject(function(item) {
            return R.contains(item.id, R.pluck('id', trackedProjects))
        }, myProjects);

        res.render('projects/add', {
            route: 'projects',
            projects: projects,
            user: req.user
        });
    }, function(err) {
        next(err);
    });
});

app.get('/projects', hasUser, function(req, res, next) {
    findAllProjects().then(function(projects) {
        res.render('projects/index', {
            route: 'projects',
            projects: projects,
            user: req.user
        });
    });
});

app.get('/projects/add/:projectName', hasUser, function(req, res, next) {
    findRepo(req.user.githubToken.accessToken, req.user.username, req.params.projectName)
        .then(function(repo) {
            return Q.all([
                storeProject(repo),
                createCommitHook(req.user.githubToken.accessToken, req.user.username, repo.name)
            ]);
        })
        .then(function() {
            res.redirect('/projects');
        }, function(err) {
            next(err);
        });
});

app.get('/features', hasUser, function(req, res, next) {
    getPullRequests().then(function(prs) {
        res.render('features', {
            apps: prs,
            route: 'features',
            user: req.user
        });
    }).catch(function(e) {
        next(e);
    });
});
app.get('/about', function(req, res, next) {
    res.render('about', {
        route: 'about',
        user: req.user
    });
});
app.get('/login', passport.authenticate('github'));
app.get('/oauth/callback', passport.authenticate('github', {
    successRedirect: '/features',
    failureRedirect: '/login'
}));
app.get('/logout', function(req, res, next) {
    req.session = null;
    res.redirect('/');
});

app.get('/fail', function(req, res, next) {
    res.send('fail');
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
