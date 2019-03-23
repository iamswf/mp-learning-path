/**
 * @file gulp file
 * @author iamswf@163.com
 */

const gulp = require('gulp');
const less = require('gulp-less');
const filter = require('gulp-filter');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const gutil = require('gulp-util');
const flatten = require('gulp-flatten');
const rename = require('gulp-rename')

const envConfig = require('./build/env.config');
const env = gutil.env.env || 'local';

/**
 * project config
 */
gulp.task('project-config', function () {
    return gulp.src(__dirname + '/src/project.config.json')
        .pipe(gulp.dest('dist'));
});

/**
 * cloud functions
 */
gulp.task('cloud-functions', function () {
    return gulp.src(__dirname + '/src/cloudfunctions/**')
        .pipe(gulp.dest('dist/cloudfunctions'));
});

/**
 * miniprogram app
 */
gulp.task('app', function () {
    return gulp.src(__dirname + '/src/miniprogram/app/**')
        .pipe(filter(['**', '!src/miniprogram/app/app.less']))
        .pipe(gulp.dest('dist/miniprogram'));
});

gulp.task('resource', function () {
    return gulp.src(__dirname + '/src/miniprogram/resource/**/*')
        .pipe(gulp.dest('dist/miniprogram/resource'));
});

// gulp.task('dep', function () {
//     return gulp.src(__dirname + '/node_modules/*/*')
//         .pipe(filter(['node_modules/meld/meld.js']))
//         .pipe(flatten())
//         .pipe(gulp.dest('dist/libs'));
// });

gulp.task('libs', function () {
    return gulp.src(__dirname + '/src/miniprogram/libs/**/*')
        .pipe(filter(['src/miniprogram/libs/**/*.js']))
        .pipe(gulp.dest('dist/miniprogram/libs'));
});

gulp.task('config', function () {
    return gulp.src(__dirname + '/src/miniprogram/config/**/*')
        .pipe(filter(['src/miniprogram/config/**/*.js']))
        .pipe(gulp.dest('dist/miniprogram/config'));
});

gulp.task('components', function () {
    return gulp.src(__dirname + '/src/miniprogram/components/**/*')
        .pipe(filter(['**', '!src/miniprogram/**/*.less']))
        .pipe(gulp.dest('dist/miniprogram/components'));
});

gulp.task('pages', function () {
    return gulp.src(__dirname + '/src/miniprogram/pages/**/*')
        .pipe(filter(['**', '!src/miniprogram/pages/**/*.less']))
        .pipe(gulp.dest('dist/miniprogram/pages'));
});

gulp.task('less-compile-page', function () {
    return gulp.src(__dirname + '/src/miniprogram/pages/**/*.less')
        .pipe(plumber())
        .pipe(less({
            paths: [__dirname + '/src/miniprogram/libs/less']
        }))
        .pipe(rename({
            extname: '.wxss'
        }))
        .on('error', function (err) {
            console.log('[less error]', err);
            this.end();
        })
        .pipe(gulp.dest('dist/miniprogram/pages'));
});

gulp.task('less-compile-app', function () {
    return gulp.src(__dirname + '/src/miniprogram/app/app.less')
        .pipe(plumber())
        .pipe(less({
            paths: [__dirname + '/src/miniprogram/libs/less']
        }))
        .pipe(rename({
            extname: '.wxss'
        }))
        .on('error', function (err) {
            console.log('[less error]', err);
            this.end();
        })
        .pipe(gulp.dest('dist/miniprogram'));
});

gulp.task('less-compile-components', function () {
    return gulp.src(__dirname + '/src/miniprogram/components/**/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(rename({
            extname: '.wxss'
        }))
        .on('error', function (err) {
            console.log('[less error]', err);
            this.end();
        })
        .pipe(gulp.dest('dist/miniprogram/components'));
});

gulp.task('build', [
    'project-config',
    'cloud-functions',
    'app',
    'less-compile-page',
    'less-compile-app',
    'less-compile-components',
    'pages',
    'resource',
    // 'dep',
    'libs',
    'config',
    'components'
]);

gulp.task('watch', function () {
    gulp.watch(['./src/cloudfunctions/**', './src/miniprogram/pages/**', './src/miniprogram/app/**', './src/miniprogram/libs/**', './src/miniprogram/components/**'], ['build']);
});
