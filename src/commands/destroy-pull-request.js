var Q = require('q'),
    mongo = require('../infrastructure/mongo');

module.exports = function(pullRequestId) {
    var deferred = Q.defer();
    mongo.getDb()
        .collection('pullRequests')
        .remove({
            'pull_request.id': pullRequestId
        }, function(err, res) {
            deferred.resolve(res);
        });
    return deferred.promise;
}
