'use strict';


const assert = require('chai').assert;
const prettyJson = require('./test-utils/prettyJson');
const sinon = require('sinon');

const moxandriaFactory = require('../dist/moxandria.js');
// const moxandriaFactory = require('../index.js');

describe('Moxandria core', function () {
    require('./test-utils/approvals-config');

    it('should be a factory', function () {
        let moxandria = moxandriaFactory();

        assert.equal(typeof moxandria, 'object');
    });

    it('should be configurable at factory call time, ignoring invalid properties', function () {
        let config = {
            cwd: 'test/mockFixtures',
            mockPaths: ['test/mocks'],
            foo: 'bar'
        };

        let moxandria = moxandriaFactory(config);

        verify(this, prettyJson(moxandria.getConfig()));
    });

    describe('Moxandria instance', function () {

        let moxandria;
        let testMock;
        let sideloadMockFactory;

        beforeEach(function () {
            let config = {
                cwd: 'test/mock-fixtures',
                mockPaths: ['']
            };

            moxandria = moxandriaFactory(config);

            sideloadMockFactory = function (mockApi) {
                return {
                    testEndpoint1: function (data, callback) {
                        var callbackData = mockApi.testEndpoint1DequeueData();
                        callback.apply(null, callbackData);
                    },
                    testEndpoint2: () => { }
                }
            }

            function functionMockFactory() {
                return function () { };
            }

            moxandria.registerMock('testMock', sideloadMockFactory);
            moxandria.registerMock('testFunctionMock', functionMockFactory);
            testMock = moxandria.buildMock('testMock');
        });

        it('should allow manual registration of mock factories', function () {
            verify(this, prettyJson(moxandria.buildMock('testMock')));
        });

        it('should throw an error if user tries to double-register on a single key', function () {
            assert.throws(moxandria.registerMock.bind(null, 'testMock', sideloadMockFactory));
        });

        it('should not blow up when loading a function-returning mock', function () {
            assert.equal(typeof moxandria.buildMock('testFunctionMock'), 'function');
        });

        it('should register a spy on mocked endpoints', function () {
            testMock.testEndpoint1EnqueueData([null, 'something']);

            testMock.testEndpoint1([1, 2], () => { });
            testMock.testEndpoint2([3, 4], () => { });

            let result = 'Test Endpoint 1 args: \n' +
                prettyJson(testMock.testEndpoint1.args) + '\n\n' +
                'Test Endpoint 2 args: \n' +
                prettyJson(testMock.testEndpoint2.args) + '\n';

            verify(this, result);
        });

        it('should call callback with provided data', function () {
            let callbackSpy = sinon.spy();

            testMock.testEndpoint1EnqueueData([null, 'something']);
            testMock.testEndpoint1EnqueueData([{ message: 'bad stuff happened' }, null]);

            testMock.testEndpoint1([], callbackSpy);
            (function myTestFn() {
                testMock.testEndpoint1([], callbackSpy);
            })();

            verify(this, prettyJson(callbackSpy.args));
        });

        it('should load mock from file system if not pre-loaded', function () {
            let filesystemTestMock = moxandria.buildMock('filesystemTestMock');
            filesystemTestMock.fsTestMock1EnqueueData([null, 'something']);
            verify(this, prettyJson(filesystemTestMock));
        });

        it('should allow definition for call on complete action', function (done) {
            let filesystemTestMock = moxandria.buildMock('filesystemTestMock');

            filesystemTestMock.fsTestMock2SetCallOnCompleteAction(function () {
                assert.equal(true, true);
                done();
            });

            filesystemTestMock.fsTestMock2();
        });

        it('should throw an error if a data queue runs out of elements', function () {
            testMock.testEndpoint1EnqueueData(['']);
            testMock.testEndpoint1([], () => null);

            assert.throws(testMock.testEndpoint1.bind(null, [], () => null));
        });

    });

});

if (typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}