var Q = require('q'),
    mongo = require('../infrastructure/mongo');

module.exports = function(oAuthResponse) {
    var deferred = Q.defer();
    var collection = mongo.getDb().collection('users');
    collection.findOne({
        id: oAuthResponse.id
    }, function(err, res) {
        if (err) {
            deferred.reject(err);
            return;
        }
        if (res) {
            deferred.resolve(res);
            return
        }
        collection.insert(oAuthResponse, function(err, res) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(res[0]);
            return;
        });
    });
    return deferred.promise;
}
