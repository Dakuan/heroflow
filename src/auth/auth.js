var CONFIG = require('../config/config'),
    R = require('ramda'),
    findOrCreateUser = require('../commands/find-or-create-user'),
    GitHubStrategy = require('passport-github').Strategy;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(new GitHubStrategy({
            clientID: CONFIG.get('githubKey'),
            clientSecret: CONFIG.get('githubSecret'),
            scope: ['repo'],
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, params, profile, done) {

            var user = R.mixin(profile, {
                githubToken: {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            });
            findOrCreateUser(user)
                .then(function(user) {
                    return done(null, user);
                }).catch(function(err) {
                    return done(err);
                });
        }
    ));
}
