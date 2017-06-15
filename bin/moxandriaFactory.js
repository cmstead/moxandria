function moxandriaFactory(
    helpers,
    registryFactory,
    sinon,
    signet
) {
    'use strict';

    return function moxandriaFactory(userConfig) {
        var cleanConfig = helpers.sanitizeObject(userConfig);

        var config = {
            cwd: cleanConfig.cwd,
            mockPaths: cleanConfig.mockPaths
        }

        var mockRegistry = registryFactory(config);

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

        function buildDataPushAction(key, functionResponseData) {
            return function pushData(data) {
                if(data.length === 0) {
                    throw new Error('Cannot enqueue an empty data array for function ' + key);
                }
                
                functionResponseData.push(data);
            }
        }

        function buildDataShiftAction(key, functionResponseData) {
            return function shiftData() {
                if (functionResponseData.length === 0) {
                    throw new Error('Cannot dequeue more data for function ' + key);
                }

                return functionResponseData.shift();
            }
        }

        function buildSetCallOnComplete(callOnComplete) {
            return function setCallOnComplete (action) {
                callOnComplete.action = action;
            }
        }

        function buildCallCompleteAction(callOnComplete) {
            return function callCompleteAction () {
                callOnComplete.action();
            }
        }

        function attachDataMethods(mockObj, mockApi) {
            function attachDataMethods(key) {
                var functionResponseData = [];
                var callOnComplete = { action: function () {} };
                var pushAction = buildDataPushAction(key, functionResponseData);
                var shiftAction = buildDataShiftAction(key, functionResponseData);

                mockObj[key + 'EnqueueData'] = signet.enforce('array => undefined', pushAction);
                mockApi[key + 'DequeueData'] = signet.enforce('() => array', shiftAction);
                
                var setCallOnComplete = buildSetCallOnComplete(callOnComplete);
                var callCompleteAction = buildCallCompleteAction(callOnComplete);

                mockObj[key + 'SetCallOnCompleteAction'] = signet.enforce('function => undefined', setCallOnComplete);
                mockApi[key + 'CallCompleteAction'] = signet.enforce('() => function', callCompleteAction);
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