'use strict';

const approvalsLocation = './test/approvals';
const quokkaApprovalsHelper = require('./quokkaApprovalsHelper');
const approvalsConfigFactory = require('approvals-config-factory');

const approvalsConfig = approvalsConfigFactory.buildApprovalsConfig({ 
    reporter: quokkaApprovalsHelper.chooseReporter('kdiff3')
});

const approvals = require('approvals').configure(approvalsConfig).mocha(approvalsLocation);
quokkaApprovalsHelper(approvals, approvalsLocation);

module.exports = approvals;