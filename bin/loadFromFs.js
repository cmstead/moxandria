function loadFromFsFactory (fs, process, require){
    'use strict';

    function statFile (filePath){
        try {
            return fs.lstatSync(filePath).isFile();
        } catch (e) {
            return false
        }
    }

    function buildFilePath (basePath, fileName) {
        return function buildFilePath (path) {
            return [basePath, path, fileName].join('/') + '.js';
        };
    }

    function loadFromFs(moduleName, config) {
        var basePath = [process.cwd(), config.cwd].join('/');

        var existingFiles = config.mockPaths
            .map(buildFilePath (basePath, moduleName))
            .filter(statFile);

        return existingFiles.length > 0 ? require(existingFiles[0]) : null;
    }

    return {
        loadFromFs: loadFromFs
    };

}

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = loadFromFsFactory;
}