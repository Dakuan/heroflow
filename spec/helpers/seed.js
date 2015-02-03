var mongo = require('../../src/infrastructure/mongo');

module.exports = function(done) {
    var done = done || function() {};
    mongo.connect(function() {
        mongo.getDb()
            .collection('pullRequests')
            .insert({
                pull_request: require('../data/github/pull-request').pull_request,
                heroku_app: require('../data/heroku/create-app-success')
            }, done);
    });
}
