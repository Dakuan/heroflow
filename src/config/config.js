var nconf = require('nconf'),
    path = require('path');

nconf.argv()
    .env()
    .file(process.env.NODE_ENV, path.join(__dirname, './', process.env.NODE_ENV + '.json'))
    .file('secret', path.join(__dirname, './secret.json'));

module.exports = nconf;