var Q = require('q'),
    request = require('request'),
    CONFIG = require('../config/config');

module.exports = function(token, owner, repo) {
    var deferred = Q.defer();
    request.post('https://api.github.com/repos/' + owner + '/' + repo + '/hooks', {
        headers: {
            Authorization: 'token ' + token,
            'User-Agent': 'heroflow'
        },
        json: true,
        body: {
            name: 'web',
            active: true,
            events: ['pull_request'],
            config: {
                url: CONFIG.get('webhook'),
                content_type: "json"
            }
        }
    }, function(err, githubResult, githubBody) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(githubBody);
    });
    return deferred.promise;
};
