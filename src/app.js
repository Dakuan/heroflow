var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('cookie-session'),
    onPullRequest = require('./event-handlers/pull-request-handler'),
    getPullRequests = require('./queries/get-pull-requests-list'),
    R = require('ramda'),
    passport = require('passport'),
    markdown = require('markdown').markdown,
    path = require('path'),
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
