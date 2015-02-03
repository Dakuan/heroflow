var Q = require('q'),
    request = require('request'),
    herokuHeaders = require('../util/heroku-headers');

module.exports = function(appId) {
    var deferred = Q.defer();

    request.del('https://api.heroku.com/apps/' + appId, {
        headers: herokuHeaders,
        json: true
    }, function(err, herokuResult, herokuBody) {
        if (err) {
        	deferred.reject(err);
            return;
        }
        deferred.resolve(herokuBody);
    });
    return deferred.promise;
};
