const constants = require('./variables');
const middlewares = require('./middlewares');
const otp = require('./otp');
const otpServer = require('./otp-server');
const errors = require('./errors');
const emailServer = require('./email-server');
const emailTemplates = require('./email-templates');
const customValidators = require('./validators');

module.exports = {
  constants, middlewares, otp, otpServer, emailServer, emailTemplates, errors, customValidators,
};
