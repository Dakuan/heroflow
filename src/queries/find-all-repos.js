var Q = require('q'),
    request = require('request'),
    CONFIG = require('../config/config');

module.exports = function(appName) {
    var deferred = Q.defer();
    request.get('https://api.github.com.com/user/repos/' + appName + '/config_vars', {
        headers: {

        },
        json: true
    }, function(err, githubResult, githubBody) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(githubResult);
    });
    return deferred.promise;
};
