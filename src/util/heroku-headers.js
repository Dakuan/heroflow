var CONFIG = require('../config/config');

module.exports = {
    Authorization: 'Bearer ' + CONFIG.get('herokuApiKey'),
    Accept: 'application/vnd.heroku+json; version=3'
};
