var request = require('request'),
    fs = require('fs');

var url = 'https://api.github.com/repos/dakuan/dom.barker/tarball/'
request.get(url, {
    headers: {
        Authorization: 'Bearer ' + '337604f3576b8cf8af2c89459182f35e32d7e4cb',
        'User-Agent': 'node'
    }
}).pipe(fs.createWriteStream('doodle.tar.gz')).on('close', function() {
    console.log(arguments);
});

var url = require('../src/util/github-url');

console.log(url('dakuan', 'dom.barker'))
