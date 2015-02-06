var Q = require('q'),
    request = require('request'),
    CONFIG = require('../config/config');

module.exports = function(token, owner, repo) {
    var deferred = Q.defer();
    request.get('https://api.github.com/repos/' + owner + '/' + repo, {
        headers: {
            Authorization: 'token ' + token,
            'User-Agent': 'heroflow'
        },
        json: true
    }, function(err, githubResult, githubBody) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(githubBody);
    });
    return deferred.promise;
};
