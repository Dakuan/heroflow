var Q = require('q'),
    mongo = require('../infrastructure/mongo');

module.exports = function(project) {
    var deferred = Q.defer();
    mongo.getDb()
        .collection('projects')
        .insert(project, function(err, createResult) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(createResult[0]);
        });
    return deferred.promise;
}
