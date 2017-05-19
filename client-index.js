var moxandria = null;

(function () {
    'use strict';

    var _fs = {
        lstatSync: function () {
            throw new Error('Not in node environment');
        }
    };
    var _process = {};
    var _require = function () { };

    var _signet = typeof signet !== 'undefined' ? signet : null;
    var _sinon = typeof sinon !== 'undefined' ? sinon : null;
    var _loadFromFsFactory = typeof loadFromFsFactory !== 'undefined' ? loadFromFsFactory : null;

    if (typeof require === 'function') {
        _fs = require('fs');
        _process = process;
        _require = require;

        _sinon = require('sinon');
    }

    var _loadFromFs = loadFromFsFactory(_fs, _process, _require);

    if (_sinon === null) {
        throw new Error('Sinon is a required peer dependency. Please install sinon and load it into your test environment before using Moxandria.');
    }

    var moxandriaBuilder = moxandriaFactory(
        moxandriaHelpers,
        mockRegistryFactory(_loadFromFs),
        _sinon,
        _signet
    );

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = moxandriaBuilder;
    } else {
        moxandria = moxandriaBuilder({});
    }

})();

