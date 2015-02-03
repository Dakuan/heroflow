var Q = require('q'),
    mongo = require('../infrastructure/mongo');

module.exports = function(pullRequestId) {
    var deferred = Q.defer();
    mongo.getDb()
        .collection('pullRequests')
        .findOne({
            'pull_request.id': pullRequestId
        }, function(err, res) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(res);
        });
    return deferred.promise;
}
