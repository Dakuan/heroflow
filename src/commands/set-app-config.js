var Q = require('q'),
    request = require('request'),
    herokuHeaders = require('../util/heroku-headers'),
    CONFIG = require('../config/config');

module.exports = function(appName, config) {
    var deferred = Q.defer();

    request.put('https://api.heroku.com/apps/' + appName + '/config_vars', {
        headers: herokuHeaders,
        body: config,
        json: true
    }, function(err, herokuResult, herokuBody) {
        if (err) {
        	deferred.reject(err);
            return;
        }
        console.log('copied config vars!');
        deferred.resolve(herokuBody);
    });
    return deferred.promise;
};
