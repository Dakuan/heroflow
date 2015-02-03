var Q = require('q'),
    request = require('request'),
    herokuHeaders = require('../util/heroku-headers'),
    CONFIG = require('../config/config');

module.exports = function(branchName) {
    var deferred = Q.defer();

    request.post('https://api.heroku.com/apps', {
        headers: herokuHeaders,
        json: true
    }, function(err, herokuResult, herokuBody) {
        if (err) {
        	deferred.reject(err);
            return;
        }
        console.log('created heroku app!');
        deferred.resolve(herokuBody);
    });
    return deferred.promise;
};
