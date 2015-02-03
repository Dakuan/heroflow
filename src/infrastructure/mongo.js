var MongoClient = require('mongodb').MongoClient,
    db,
    url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/nabu-deployer';

module.exports = {
    connect: function(next) {
        MongoClient.connect(url, function(err, connection) {
            if (err) {
                next(err, null);
                return;
            }
            db = connection;
            next(null, db);
        });
    },
    getDb: function() {
        if (db) {
            return db;
        } else {
            throw new Error('no db');
        }
    }
};