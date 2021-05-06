module.exports = {
  /**
   * Unverified email error
   */
  EMAIL_UNVERIFIED: {
    code: 401,
    error: new Error('Email not verified'),
  },

  /**
   * Error on failure to fetch client access
   */
  PHONE_UNVERIFIED: {
    code: 401,
    error: new Error('Phone number not verified'),
  },

  /**
   * Error on failure to fetch client access
   */
  PHONE_EMAIL_UNVERIFIED: {
    code: 401,
    error: new Error('Phone and email not verified'),
  },

  /**
   * Error on invalid OTP
   */
  INVALID_OTP: {
    code: 401,
    error: new Error('Invalid OTP'),
  },

  /**
   * Error on OTP generation
   */
  OTP_GENERATION_FAILED: {
    code: 500,
    error: new Error('Couldn\'t generate OTP'),
  },

  /**
   * Error on OTP generation
   */
  OTP_SEND_FAILED: {
    code: 500,
    error: new Error('Couldn\'t send OTP'),
  },

  /**
   * Error on OTP generation
   */
  FIND_TOTP_FAILED: {
    code: 500,
    error: new Error('Couldn\'t find OTP in registry'),
  },

  /**
   * 
   */
  UNAVAILABLE_OTP: {
    code: 404,
    error: new Error('OTP isn\'t available'),
  },

  /**
   * Error on failure to fetch client access
   */
  FIND_CLIENT: {
    code: 500,
    error: new Error('Couldn\'t verify your identity'),
  },

  /**
   * Error on failure to fetch client access
   */
  NO_CLIENT: {
    code: 401,
    error: new Error('Unauthorized client'),
  },

  /**
   * Error on failure to fetch client access
   */
  CLIENT_ADD_FAILURE: {
    code: 500,
    error: new Error('Couldn\'t register client'),
  },

  /**
   * Error on failure to create client access
   */
  SIGN_IN: {
    code: 500,
    error: new Error('Couldn\'t sign you in'),
  },

  /**
   * Error on failure to remove client access
   */
  SIGN_OUT: {
    code: 500,
    error: new Error('Couldn\'t sign you out'),
  },

  /**
   * Error on retrieving user
   */
  FIND_USER: {
    code: 500,
    error: new Error('Couldn\'t find user'),
  },

  /**
   * Error on retrieving user
   */
  NO_USER: {
    code: 404,
    error: new Error('User doesn\'t exist'),
  },

  /**
   * User already exists
   */
  USER_EXISTS: {
    code: 409,
    error: new Error('User already exists'),
  },

  /**
   * User creation failure error
   */
  USER_ADD_FAILURE: {
    code: 500,
    error: new Error('Couldn\'t create user'),
  },

  /**
   * User creation failure error
   */
  USER_UPDATE_FAILURE: {
    code: 500,
    error: new Error('Couldn\'t update user'),
  },

  /**
   * `access-token` not supplied error
   */
  NO_ACCESS_TOKEN: {
    code: 401,
    error: new Error('Operation requires \'access-token\''),
  },

  /**
   * `device-id` not supplied error
   */
  NO_DEVICE_ID: {
    code: 403,
    error: new Error('Operation requires \'device-id\''),
  },

  /**
   * `user-agent` not supplied error
   */
  NO_USER_AGENT: {
    code: 403,
    error: new Error('Operation requires \'user-agent\''),
  },

  /**
   * `user-agent` not supplied error
   */
  IMAGE_READ_FAILED: {
    code: 501,
    error: new Error('Couldn\'t read image'),
  },

  /**
   * `password` compare failure
   */
  PASSWORD_COMPARE_FAILED: {
    code: 500,
    error: new Error('Couldn\'t check password'),
  },

  /**
   * `password` incorrect error
   */
  PASSWORD_INCORRECT: {
    code: 401,
    error: new Error('Incorrect password'),
  },

  /**
   * Validation error generator
   * @param {Error} error Error instance
   */
  VALIDATION_ERROR: (error) => ({
    code: 406,
    error: new Error(`Validation failed: ${error.message}`),
  }),

  /**
   * Forbidden fields update error generator
   * @param {Array<string>} fields Error instance
   */
  FORBIDDEN_UPDATE_ERROR: (fields) => ({
    code: 406,
    error: new Error(`Validation failed: ${fields.join(', ')}`),
  }),
};
