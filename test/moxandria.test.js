'use strict';

require('./test-utils/approvals-config');

const assert = require('chai').assert;
const prettyJson = require('./test-utils/prettyJson');
const sinon = require('sinon');

const moxandriaFactory = require('../index.js');

describe('Moxandria core', function () {

    it('should be a factory', function () {
        let moxandria = moxandriaFactory();

        assert.equal(typeof moxandria, 'object');
    });

    it('should be configurable at factory call time, ignoring invalid properties', function () {
        let config = {
            mockPaths: ['test/mocks'],
            foo: 'bar'
        };

        let moxandria = moxandriaFactory(config);

        this.verify(prettyJson(moxandria.getConfig()));
    });

    describe('Moxandria instance', function () {

        let moxandria;
        let testMock;
        let sideloadMockFactory;

        beforeEach(function () {
            moxandria = moxandriaFactory();

            sideloadMockFactory = function (mockApi) {
                return {
                    testEndpoint1: function (data, callback) {
                        var callbackData = mockApi.testEndpoint1DequeueData();
                        callback.apply(null, callbackData);
                    },
                    testEndpoint2: () => { }
                }
            }

            moxandria.registerMock('testMock', sideloadMockFactory);
            testMock = moxandria.buildMock('testMock');
        });

        it('should allow manual registration of mock factories', function () {
            this.verify(prettyJson(moxandria.buildMock('testMock')));
        });

        it('should throw an error if user tries to double-register on a single key', function () {
            assert.throws(moxandria.registerMock.bind(null, 'testMock', sideloadMockFactory));
        });

        it('should register a spy on mocked endpoints', function () {
            testMock.testEndpoint1EnqueueData([null, 'something']);

            testMock.testEndpoint1([1, 2], () => { });
            testMock.testEndpoint2([3, 4], () => { });

            let result = 'Test Endpoint 1 args: \n' +
                prettyJson(testMock.testEndpoint1.args) + '\n\n' +
                'Test Endpoint 2 args: \n' +
                prettyJson(testMock.testEndpoint2.args) + '\n';

            this.verify(result);
        });

        it('should call callback with provided data', function () {
            let callbackSpy = sinon.spy();

            testMock.testEndpoint1EnqueueData([null, 'something']);
            testMock.testEndpoint1EnqueueData([{ message: 'bad stuff happened' }, null]);

            testMock.testEndpoint1([], callbackSpy);
            testMock.testEndpoint1([], callbackSpy);

            this.verify(prettyJson(callbackSpy.args));
        });

    });

});