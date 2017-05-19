function moxandriaFactory(
    helpers,
    registryFactory,
    sinon,
    signet
) {
    'use strict';

    return function moxandriaFactory(userConfig) {
        var mockRegistry = registryFactory();

        var cleanConfig = helpers.sanitizeObject(userConfig);

        var config = {
            mockPaths: cleanConfig.mockPaths
        }

        function getConfig() {
            return helpers.copyObjectProperties(config);
        }

        function applyForMockFunctions(mockObj, applicator) {
            function isFunctionKey(key) {
                return typeof mockObj[key] === 'function';
            }

            Object.keys(mockObj)
                .filter(isFunctionKey)
                .forEach(applicator);
        }

        function attachSpies(mockObj) {
            function spyOnMethod(key) {
                sinon.spy(mockObj, key);
            }

            applyForMockFunctions(mockObj, spyOnMethod);
        }

        function buildDataPushAction(functionResponseData) {
            return function pushData(data) {
                functionResponseData.push(data);
            }
        }

        function buildDataShiftAction(functionResponseData) {
            return function shiftData() {
                if (functionResponseData.length === 0) {
                    throw new Error('No more data to dequeue for function calls');
                }

                return functionResponseData.shift();
            }
        }

        function attachDataMethods(mockObj, mockApi) {
            function attachDataMethods(key) {
                var functionResponseData = [];
                var pushAction = buildDataPushAction(functionResponseData);
                var shiftAction = buildDataShiftAction(functionResponseData);


                mockObj[key + 'EnqueueData'] = signet.enforce('array => undefined', pushAction);
                mockApi[key + 'DequeueData'] = signet.enforce('() => array', shiftAction);
            }

            applyForMockFunctions(mockObj, attachDataMethods)
        }

        function prepareMockExtension(mockObj, mockApi) {
            attachSpies(mockObj);
            attachDataMethods(mockObj, mockApi);

            return mockObj;
        }

        function buildMock(mockName) {
            var mockApi = {};
            var newMock = mockRegistry.getMock(mockName)(mockApi);

            return typeof newMock === 'object' ?
                prepareMockExtension(newMock, mockApi) :
                newMock;
        }

        return {
            buildMock: signet.enforce('mockName:string => *', buildMock),
            getConfig: signet.enforce('() => config:object', getConfig),
            registerMock: signet.enforce('mockName:string, mockFactory:function => undefined', mockRegistry.registerMock)
        };
    }

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = moxandriaFactory;
}