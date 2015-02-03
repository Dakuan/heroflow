var Q = require('q'),
    request = require('request'),
    herokuHeaders = require('../util/heroku-headers'),
    CONFIG = require('../config/config');

module.exports = function(appName, url) {
    var deferred = Q.defer();
    request.post('https://api.heroku.com/apps/' + appName + '/builds', {
        headers: herokuHeaders,
        body: {
            source_blob: {
                url: url
            }
        },
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
