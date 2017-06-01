module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['mocha', 'sinon'],
    browsers: ['PhantomJS'],
    files: [
        './node_modules/chai/chai.js',
        './dist/moxandria.js',
        './test/test-utils/prettyJson.js',
        './client-test/moxandria-client.test.js'
    ],

    colors: true,
    reporters: ['progress'],

    singleRun: true,
    autoWatch: false
  });
};