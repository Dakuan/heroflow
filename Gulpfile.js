var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    server = require('gulp-develop-server'),
    env = require('gulp-env'),
    less = require('gulp-less');

var paths = {
    server: 'src/**/*.js',
    styleSheets: 'src/stylesheets/**/*.less'
};

// default task
gulp.task('default', ['less', 'server:start'], function() {
    gulp.watch([paths.server], server.restart);
    gulp.watch(paths.styleSheets, ['less']);
});


// compile less to css
gulp.task('less', function() {
    gulp.src('src/stylesheets/heroflow.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('build/css'));
});

// run server locally
gulp.task('server:start', function() {
    var opts = {
        NODE_ENV: 'local'
    };
    server.listen({
        path: 'src/index.js',
        env: opts
    });
});

