var moxandriaHelpers = (function () {
    'use strict';
    
    function sanitizeObject(userConfig) {
        return typeof userConfig === 'object' && userConfig !== null ? userConfig : {};
    }

    function copyObjectProperties (originalObj){
        return JSON.parse(JSON.stringify(originalObj));
    }

    return {
        copyObjectProperties: copyObjectProperties,
        sanitizeObject: sanitizeObject
    };
})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = moxandriaHelpers;
}