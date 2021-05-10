const constants = require('./variables');
const middlewares = require('./middlewares');
const otp = require('./otp');
const smsServer = require('./sms-server');
const errors = require('./errors');
const emailServer = require('./email-server');
const customValidators = require('./validators');

module.exports = {
  constants, middlewares, otp, smsServer, emailServer, errors, customValidators,
};
