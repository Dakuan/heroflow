var Q = require('q'),
    mongo = require('../infrastructure/mongo');

module.exports = function(pullRequest) {
    var deferred = Q.defer();
    mongo.getDb()
        .collection('pullRequests')
        .insert(pullRequest, function(err, createResult) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(createResult);
        });
    return deferred.promise;
}
