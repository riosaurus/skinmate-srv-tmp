/* eslint-disable no-console */
// const User=require('../database/user')
const mailService = require('@sendgrid/mail');
const speakeasy = require('speakeasy');
const { serviceEmailAPIKey, serviceEmail } = require('./variables');

mailService.setApiKey(serviceEmailAPIKey());

const htmlTemplate = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email not veified</title>
    <style>
      h3{
        font-size: 2rem;
        font-weight: 600;
        text-align: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
    </style>
  </head>
  <body>
    <h3>Hi {{user}}</h3>
    <p>Use {{otp}} as the OTP to verify your email.
  </body>
</html>`;

/**
 * Generates OTP based on `secret` and sends email using template.
 * @param {String} email
 * @param {String} secret
 * @returns {Promise<void>}
 */
async function sendVerificationEmail(to, secret) {
  const otp = speakeasy.totp({
    secret,
    encoding: 'base32',
    digits: 6,
  });
  await mailService.send({
    to,
    from: serviceEmail(),
    subject: 'Verify your email',
    html: htmlTemplate
      .replace('{{user}}', to)
      .replace('{{otp}}', otp),
  });
}

module.exports = { sendVerificationEmail };
