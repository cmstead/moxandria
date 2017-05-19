'use strict';

var sinon = require('sinon');
var signet = require('signet')();
var moxandriaFactory = require('./bin/moxandriaFactory');
var helpers = require('./bin/moxandriaHelpers');
var registryFactory = require('./bin/moxandriaRegistryFactory');

module.exports = moxandriaFactory(
    helpers,
    registryFactory,
    sinon,
    signet
);