'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const flow = require('gulp-flowtype');
const eslint = require('gulp-eslint');

const sourceFiles = [
    '**/bin/*.js',
    'index.js',
    '!node_modules/**'
];

const testFiles = [
    'test/**/*.js'
];

const flowConfig = {
    all: false,
    weak: false,
    declarations: './declarations',
    killFlow: false,
    beep: false,
    abort: false
};

gulp.task('lint', () => {
    return gulp.src(testFiles.concat(sourceFiles))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('flow', function () {
    return gulp.src(sourceFiles)
        .pipe(flow(flowConfig));
});

gulp.task('pre-test', function () {
    return gulp.src(sourceFiles)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['lint', 'flow', 'pre-test'], function () {
    gulp.src(testFiles, { read: false })
        .pipe(mocha())
        .pipe(istanbul.writeReports({ reporters: ['text-summary'] }))
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }));
});