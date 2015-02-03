var app = require('../src/app'),
    mongo = require('../src/infrastructure/mongo'),
    CONFIG = require('../src/config/config'),
    nock = require('nock'),
    seed = require('./helpers/seed'),
    assert = require("assert"),
    request = require('supertest');

var heroku = nock('https://api.heroku.com')
    .matchHeader('Accept', 'application/vnd.heroku+json; version=3')
    .matchHeader('Authorization', 'Bearer ' + CONFIG.get('herokuApiKey'))
    .filteringRequestBody(/.*/, '*');

describe("Handle Pull Request events", function() {

    before(function(done) {
        mongo.connect(done);
    });

    describe("when a open pull request event is triggered", function() {

        describe("when heroku creates the new app successfully", function() {
            var scope;
            beforeEach(function() {
                scope = heroku.post('/apps')
                    .reply(201, require('./data/heroku/create-app-success'))
                    .get('/apps/quill-nabu-dev/config_vars')
                    .reply(200, require('./data/heroku/get-config-vars'))
                    .put('/apps/test-app/config_vars')
                    .reply(200, require('./data/heroku/set-config-vars'))
                    .post('/apps/test-app/builds')
                    .reply(201, require('./data/heroku/create-build-success'))
                    .post('/apps/test-app/releases')
                    .reply(201);
            });
            it("should return 200", function(done) {
                request(app)
                    .post('/github')
                    .send(require('./data/github/pull-request'))
                    .expect(200, done);
            });
            it('should call all the endpoints', function(done) {
                request(app)
                    .post('/github')
                    .send(require('./data/github/pull-request'))
                    .end(function() {
                        assert(scope.isDone());
                        done();
                    });
            });
        });
    });

    describe("when a close pull request event is triggered", function() {
        var scope;

        beforeEach(function(done) {
            scope = heroku
                .delete('/apps/test-app')
                .reply(204, {});

            seed(done);
        });

        it("should return a 204", function(done) {
            request(app)
                .post('/github')
                .send(require('./data/github/pull-request-closed'))
                .expect(204, done);
        });

        it("should call all the endpoints", function(done) {
            request(app)
                .post('/github')
                .send(require('./data/github/pull-request-closed'))
                .end(function() {
                    assert(scope.isDone());
                    done();
                });
        });

        after(function(done) {
            mongo.getDb()
                .collection('pullRequests')
                .drop(done);
        });
    });

    describe("when a sync pull request event is triggered", function() {
        var scope;

        beforeEach(function(done) {
            seed(done);
            scope = heroku.post('/apps/test-app/builds')
                .reply(201, require('./data/heroku/create-build-success'))
                .post('/apps/test-app/releases')
                .reply(201, {});
        });

        it("should return a 201", function(done) {
            request(app)
                .post('/github')
                .send(require('./data/github/pull-request-sync'))
                .expect(201, done);
        });

        it("should call all the endpoints", function(done) {
            request(app)
                .post('/github')
                .send(require('./data/github/pull-request-sync'))
                .end(function() {
                    assert(scope.isDone());
                    done();
                });
        });

        after(function(done) {
            mongo.getDb()
                .collection('pullRequests')
                .drop(done);
        });
    });
});
