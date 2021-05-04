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
   * @default 'http://127.0.0.1:3001' (fallback value)
   * @returns {url} api url
   */
  Url:()=> process.env.URL || 'http://127.0.0.1:3001',

  /**
   * @default "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" (fallback value)
   * @returns {String} send grid api key
   */
   EmailAPIKey:()=> process.env.EMAIL_API_KEY || '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',

   /**
   * @default 'skinmate.24x7@gmail.com' (fallback value)
   * @returns {String} email adress for skinmate
   */
  EmailAddress:()=> process.env.EMAIL_ADDRESS || 'skinmate.24x7@gmail.com'
};
