/**
 * Environment specific run-time constants
 */
module.exports = {
    /**
     * Port number to listen on.
     * @default 8080 (fallback value)
     */
    PORT: () => process.env['PORT'] || 8080,

    /**
     * Secret key for JWT Tokens
     * @default "dummy_key" (fallback value)
     */
    TOKEN_KEY: () => process.env['TOKEN_KEY'] || "dummy_key",

    /**
     * MongoDB connection URI
     * @default test (fallback collection)
     */
    MONGO_URI: () => process.env['DB_URI'] || "mongodb://127.0.0.1:27017/test"
}