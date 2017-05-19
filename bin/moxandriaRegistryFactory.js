function mockRegistryFactory(mockLoader) {
    'use strict';
    
    return function registryFactory(config) {
        var registeredMocks = {};

        function registerMock(mockName, mockFactory) {
            if (typeof registeredMocks[mockName] !== 'undefined') {
                throw new Error('A mock is already registered by the name ' + mockFactory);
            }

            registeredMocks[mockName] = mockFactory;
        }

        function loadAndRegsiter(mockName) {
            var loadedMock = mockLoader.loadFromFs(mockName, config);

            if(loadedMock !== null) {
                registerMock(mockName, loadedMock);
            }

            return loadedMock;
        }

        function getMock(mockName) {
            var registeredMock = registeredMocks[mockName];

            if(typeof registeredMock === 'undefined') {
                registeredMock = loadAndRegsiter(mockName);
            }

            if (registeredMock === null) {
                throw new Error('No mock registered named ' + mockName);
            }

            return registeredMock;
        }

        return {
            registerMock: registerMock,
            getMock: getMock
        };
    }

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = mockRegistryFactory;
}