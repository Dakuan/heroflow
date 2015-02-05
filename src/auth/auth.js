var CONFIG = require('../config/config'),
    // User = require('../data/user-data'),
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
            clientID: 'd2809f37046fc7df772d',
            clientSecret: '5a0837873c32745b5fa073d25de1c28f5e2d78d0',
            callbackURL: "http://localhost:6061/oauth/callback",
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
