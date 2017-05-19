'use strict';

function getFunctionName(value) {
    var functionName = value.name === '' ? 'anonymous function' : value.name;
    return 'Function: ' + functionName;
}

function functionToName (value) {
    return typeof value === 'function' ? getFunctionName(value) : value;
}

function preprocessValues (key, value) {
    return functionToName(value);
}

module.exports = function prettyJson (value) {
    return JSON.stringify(value, preprocessValues, 4);
}