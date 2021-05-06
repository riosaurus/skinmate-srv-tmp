const speakeasy = require('speakeasy');

/**
 * Generates OTP based on `secret`
 * @param {string} secret Base64 secret key for OTP generation
 */
function generateOTP(secret) {
  return speakeasy.totp({
    secret,
    encoding: 'base32',
    digits: 6,
  });
}

/**
 * Verifies OTP `token` based on `secret`
 * @param {string} secret Base64 secret key
 * @param {string} token Phone address to send OTP to
 * @returns {boolean}
 */
function verifyOTP(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 10,
  });
}

module.exports = { generateOTP, verifyOTP };
