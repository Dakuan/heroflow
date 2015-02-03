var R = require('ramda'),
    CONFIG = require('../config/config');

module.exports = function(user, repo, branch) {
    return [
        'https://api.github.com/repos/',
        user,
        '/',
        repo,
        '/',
        'tarball/',
        branch || 'master',
        '?access_token=',
        CONFIG.get('githubToken')
    ].join('');
};
