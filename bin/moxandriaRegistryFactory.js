function registryFactory() {
    var registeredMocks = {};

    function registerMock(mockName, mockFactory) {
        if (typeof registeredMocks[mockName] !== 'undefined') {
            throw new Error('A mock is already registered by the name ' + mockFactory);
        }

        registeredMocks[mockName] = mockFactory;
    }

    function getMock(mockName) {
        var registeredMock = registeredMocks[mockName];

        if (typeof registeredMock === 'undefined') {
            throw new Error('No mock registered named ' + mockName);
        }

        return registeredMock;
    }

    return {
        registerMock: registerMock,
        getMock: getMock
    };
}

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = registryFactory;
}