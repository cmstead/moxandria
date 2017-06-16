'use strict';

function approvalsHelperFactory(approvals, approvalsPath) {

    function getFullName(context) {
        let nameTokens = [];
        let currentContext = context.test;

        while (currentContext && currentContext.parent) {
            let titleToken = currentContext.title.replace(/\W|\s/gi, '_');
            nameTokens.unshift(titleToken);
            currentContext = currentContext.parent;
        }

        return nameTokens.join('.');
    }

    function approve(context, methodName, args) {
        let testName = (typeof context !== 'undefined') ? getFullName(context) : '_quokka-report';
        let approvalsArgs = [approvalsPath, testName];

        approvals[methodName].apply(approvals, approvalsArgs.concat(args));
    }

    const verifyByMethod = (methodName) => (context, ...args) => {
        let data = args[0];

        if (typeof global.runQuokkaMochaBdd === 'function') {
            try {
                approve(context, methodName, args);
            } catch (e) {
                throw new Error('Resulting Output: ' + data);
            }
        } else {
            approve(context, methodName, args);
        }

    }

    before(function quokkaMochaBddApprovalReporter() {
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

approvalsHelperFactory.chooseReporter = chooseReporter;

module.exports = approvalsHelperFactory;