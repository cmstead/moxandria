'use strict';

function quokkaApprovalsHelper() {

    const verifyByMethod = (methodName) => (context, ...args) => {
        let data = args[0];

        if (typeof global.runQuokkaMochaBdd === 'function') {
            try {
                context[methodName].apply(context, args);
            } catch (e) {
                throw new Error('Resulting Output: ' + data);
            }
        } else {
            context[methodName].apply(context, args);
        }

    }

    before(function () {
        global.verifyAsJSON = verifyByMethod('verifyAsJSON');
        global.verifyAsJSONAndScrub = verifyByMethod('verifyAsJSONAndScrub');
        global.verify = verifyByMethod('verify');
        global.verifyAndScrub = verifyByMethod('verifyAndScrub');
        global.verifyWithControl = verifyByMethod('verifyWithControl');
    });

}

function chooseReporter(preferredReporter) {
    return typeof runQuokkaMochaBdd === 'function' ? 'donothing' : preferredReporter;
}

quokkaApprovalsHelper.chooseReporter = chooseReporter;

module.exports = quokkaApprovalsHelper;