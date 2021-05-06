/**
 * Environment specific run-time constants
 */
module.exports = {
  /**
     * Port number to listen on.
     * @default 8080 (fallback value)
     * @return {number} PORT number as string
     */
  port: () => parseInt(process.env.PORT, 10) || 8080,

  /**
   * Secret key for JWT Tokens
   * @default "dummy_key" (fallback value)
   * @return {string} token key
   */
  token: () => process.env.TOKEN_KEY || 'dummy_key',

  /**
   * MongoDB connection URI
   * @default test (fallback collection)
   * @return {string} mongo connection URI
   */
  mongoUri: () => process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test',

  /**
   * @default "" (fallback value)
   * @returns {String} send grid api key
   */
  serviceEmailAPIKey: () => process.env.EMAIL_SERVICE_API_KEY || '',

  /**
   * @default 'skinmate.24x7@gmail.com' (fallback value)
   * @returns {String}  service email
   */
  serviceEmail: () => process.env.SERVICE_EMAIL || 'skinmate.24x7@gmail.com',

  /**
   * Verification email template path
   */
  EMAIL_TEMPLATE_VERIFICATION: '/assets/verification-email.hbs',
};
