var CONFIG = require('../config/config'),
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
            passReqToCallback: true
        },
        function(req, token, tokenSecret, profile, done) {

            findOrCreateUser(profile)
                .then(function(user) {
                    return done(null, user);
                }).catch(function(err) {
                    return done(err);
                });
        }
    ));
}
