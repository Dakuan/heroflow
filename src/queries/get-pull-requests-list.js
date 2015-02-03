var Q = require('q'),
    mongo = require('../infrastructure/mongo');

module.exports = function() {
    var deferred = Q.defer();

    mongo.getDb()
        .collection('pullRequests')
        .find()
        .toArray(function(err, prs) {
            deferred.resolve(prs);
        });

    return deferred.promise;
}
