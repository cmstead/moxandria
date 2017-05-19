'use strict';

var fs = require('fs');

var sinon = require('sinon');
var signet = require('signet')();
var moxandriaFactory = require('./bin/moxandriaFactory');
var helpers = require('./bin/moxandriaHelpers');
var registryFactory = require('./bin/moxandriaRegistryFactory');
var loadFromFs = require('./bin/loadFromFs')(fs, process, require);

module.exports = moxandriaFactory(
    helpers,
    registryFactory(loadFromFs),
    sinon,
    signet
);