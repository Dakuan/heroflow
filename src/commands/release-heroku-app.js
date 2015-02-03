var Q = require('q'),
    request = require('request'),
    herokuHeaders = require('../util/heroku-headers'),
    CONFIG = require('../config/config');

module.exports = function(appName, slugId) {
    var deferred = Q.defer();

    request.post('https://api.heroku.com/apps/' + appName + '/releases', {
        headers: herokuHeaders,
        body: {
            slug: slugId
        },
        json: true
    }, function(err, herokuResult, herokuBody) {
        if (err) {
            deferred.reject(err);
            return;
        }
        console.log('heroku app deployed!');
        deferred.resolve(herokuBody);
    });
    return deferred.promise;
};
