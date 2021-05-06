/* eslint-disable no-console */
const mailService = require('@sendgrid/mail');
const { serviceEmailAPIKey, serviceEmail } = require('./variables');

mailService.setApiKey(serviceEmailAPIKey());

/**
 * Sends email.
 * @param {String} to
 * @param {String} subject
 * @param {String} html
 */
async function sendMail(to, subject, html) {
  return mailService.send({
    to,
    from: serviceEmail(),
    subject,
    html,
  });
}

module.exports = { sendMail };
