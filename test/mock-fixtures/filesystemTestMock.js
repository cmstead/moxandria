function filesystemTestMock (mockApi) {
    return {
        fsTestMock1: function (param1, param2, callback) {
            var callbackData = mockApi.fsTestMock1DequeueData();
            callback.apply(null, callbackData);
        },
        fsTestMock2: function () {
            mockApi.fsTestMock2CallCompleteAction();
        }
    };
}

module.exports = filesystemTestMock;