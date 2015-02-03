var Q = require('q'),
    request = require('request'),
    herokuHeaders = require('../util/heroku-headers'),
    CONFIG = require('../config/config');

module.exports = function(appName) {
    var deferred = Q.defer();
    request.get('https://api.heroku.com/apps/' + appName + '/config_vars', {
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
