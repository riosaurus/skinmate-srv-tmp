/* eslint-disable no-console */
const { readFileSync } = require('fs');
const { compile } = require('handlebars');
const mjml = require('mjml');
const mailService = require('@sendgrid/mail');
const { serviceEmailAPIKey, serviceEmail, serviceName } = require('./variables');

function init() {
  mailService.setApiKey(serviceEmailAPIKey());
}

/**
 * Sends email.
 * @param {string} to
 * @param {string} subject
 * @param {string} template path
 * @param {{[key: string]: string}} context
 */
async function sendMail(to, subject, template, context) {
  const hbsFile = readFileSync(template, { encoding: 'utf8' });
  const compiledTemplate = compile(hbsFile);
  const mjmlMarkup = compiledTemplate(context);
  const mjmlData = mjml(mjmlMarkup);
  if (mjmlData.errors.length > 0) {
    throw new Error('Error parsing email template');
  }
  return mailService.send({
    to,
    from: {
      name: serviceName(),
      email: serviceEmail(),
    },
    subject,
    html: mjmlData.html,
  });
}

module.exports = { init, sendMail };
