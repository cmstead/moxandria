'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const eslint = require('gulp-eslint');
var concat = require('gulp-concat');
 
const sourceFiles = [
    'bin/*.js',
    'index.js',
    '!node_modules/**'
];

const testFiles = [
    'test/**/*.js'
];

var compileFiles = ['./node_modules/signet/dist/signet.js'].concat(sourceFiles.slice(0, 1)).concat(['client-index.js']);


gulp.task('compile', function() {
  return gulp.src(compileFiles)
    .pipe(concat('moxandria.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('lint', () => {
    return gulp.src(sourceFiles)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('pre-test', function () {
    return gulp.src(sourceFiles)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['lint', 'pre-test', 'compile'], function () {
    gulp.src(testFiles, { read: false })
        .pipe(mocha())
        .pipe(istanbul.writeReports({ reporters: ['text-summary'] }))
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }));
});
