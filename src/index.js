var app = require('./app'),
    mongo = require('./infrastructure/mongo');

// boot
mongo.connect(function(err, db) {
    if (err) {
        // cant recover from lack of db :'(
        throw err;
    }
    console.log('connected to db!');
    var server = app.listen(process.env.PORT || 6061, function() {
        var host = server.address().address
        var port = server.address().port
        console.log('App listening at http://%s:%s', host, port)
    });
});
