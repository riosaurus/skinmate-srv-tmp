const constants = require('./variables');
const middlewares = require('./middlewares');
const otpServer = require('./otp-server');
const errors = require('./errors');
const emailServer = require('./email-server');

module.exports = { constants, middlewares, otpServer, emailServer, errors };
