module.exports = {

  /* Comms errors */
  EMAIL_UNVERIFIED: {
    code: 403,
    error: new Error('Email not verified'),
  },

  PHONE_UNVERIFIED: {
    code: 403,
    error: new Error('Phone number not verified'),
  },

  PHONE_EMAIL_UNVERIFIED: {
    code: 403,
    error: new Error('Phone and email not verified'),
  },

  EMAIL_ALREADY_VERIFIED: {
    code: 409,
    error: new Error('Email already verified'),
  },

  PHONE_ALREADY_VERIFIED: {
    code: 409,
    error: new Error('Phone already verified'),
  },

  NO_ELEVATED_ACCESS: {
    code: 401,
    error: new Error('Operation requires elevated privileges'),
  },

  /* OTP errors */
  INVALID_OTP: {
    code: 401,
    error: new Error('Invalid OTP'),
  },

  OTP_GENERATION_FAILED: {
    code: 500,
    error: new Error('Couldn\'t generate OTP'),
  },

  OTP_SEND_FAILED: {
    code: 500,
    error: new Error('Couldn\'t send OTP'),
  },

  UNAVAILABLE_OTP: {
    code: 404,
    error: new Error('OTP isn\'t available'),
  },

  /* Document fetch fail errors */
  FIND_TOTP_FAILED: {
    code: 500,
    error: new Error('Couldn\'t find OTP in registry'),
  },

  FIND_CLIENT_FAILED: {
    code: 500,
    error: new Error('Couldn\'t find device'),
  },

  FIND_USER_FAILED: {
    code: 500,
    error: new Error('Couldn\'t find user'),
  },

  FIND_DOCTOR_FAILED: {
    code: 500,
    error: new Error('Couldn\'t find doctor'),
  },

  FIND_APPOINTMENT_FAILED: {
    code: 500,
    error: new Error('Couldn\'t find appointment'),
  },

  FIND_SERVICE_FAILED: {
    code: 500,
    error: new Error('Couldn\'t find service'),
  },

  FIND_FAMILY_FAILED: {
    code: 500,
    error: new Error('Couldn\'t find member'),
  },

  /* Document save errors */
  SAVE_CLIENT_FAILED: {
    code: 500,
    error: new Error('Couldn\'t register client'),
  },

  SAVE_USER_FAILED: {
    code: 500,
    error: new Error('Couldn\'t add user'),
  },

  SAVE_TOTP_FAILED: {
    code: 500,
    error: new Error('Couldn\'t register OTP in registry'),
  },

  SAVE_DOCTOR_FAILED: {
    code: 500,
    error: new Error('Couldn\'t add doctor'),
  },

  SAVE_APPOINTMENT_FAILED: {
    code: 500,
    error: new Error('Couldn\'t save appointment'),
  },

  SAVE_SERVICE_FAILED: {
    code: 500,
    error: new Error('Couldn\'t add service'),
  },

  SAVE_FAMILY_FAILED: {
    code: 500,
    error: new Error('Couldn\'t add member'),
  },

  /* Document update errors */
  UPDATE_CLIENT_FAILED: {
    code: 500,
    error: new Error('Couldn\'t update client'),
  },

  UPDATE_USER_FAILED: {
    code: 500,
    error: new Error('Couldn\'t update user'),
  },

  UPDATE_TOTP_FAILED: {
    code: 500,
    error: new Error('Couldn\'t update OTP registry'),
  },

  UPDATE_DOCTOR_FAILED: {
    code: 500,
    error: new Error('Couldn\'t update doctor'),
  },

  UPDATE_APPOINTMENT_FAILED: {
    code: 500,
    error: new Error('Couldn\'t update appointment'),
  },

  UPDATE_SERVICE_FAILED: {
    code: 500,
    error: new Error('Couldn\'t update service'),
  },

  UPDATE_FAMILY_FAILED: {
    code: 500,
    error: new Error('Couldn\'t update member'),
  },

  /* Document remove errors */
  DELETE_CLIENT_FAILED: {
    code: 500,
    error: new Error('Couldn\'t delete client'),
  },

  DELETE_USER_FAILED: {
    code: 500,
    error: new Error('Couldn\'t delete user'),
  },

  DELETE_TOTP_FAILED: {
    code: 500,
    error: new Error('Couldn\'t delete OTP from registry'),
  },

  DELETE_DOCTOR_FAILED: {
    code: 500,
    error: new Error('Couldn\'t delete doctor'),
  },

  DELETE_APPOINTMENT_FAILED: {
    code: 500,
    error: new Error('Couldn\'t delete appointment'),
  },

  DELETE_SERVICE_FAILED: {
    code: 500,
    error: new Error('Couldn\'t delete service'),
  },

  DELETE_FAMILY_FAILED: {
    code: 500,
    error: new Error('Couldn\'t delete member'),
  },

  /* Null Document errors */
  NULL_CLIENT: {
    code: 401,
    error: new Error('Unauthorized client'),
  },

  NULL_USER: {
    code: 404,
    error: new Error('User doesn\'t exist'),
  },

  NULL_TOTP: {
    code: 403,
    error: new Error('No such OTP requested'),
  },

  NULL_DOCTOR: {
    code: 404,
    error: new Error('Doctor doesn\'t exist'),
  },

  NULL_APPOINTMENT: {
    code: 404,
    error: new Error('Appointment isn\'t available'),
  },

  NULL_SERVICE: {
    code: 404,
    error: new Error('No such service'),
  },

  NULL_FAMILY: {
    code: 404,
    error: new Error('Member isn\'t available'),
  },

  /* Null properties errors */
  NULL_ACCESS_TOKEN: {
    code: 401,
    error: new Error('Operation requires \'access-token\''),
  },

  NULL_DEVICE_ID: {
    code: 403,
    error: new Error('Operation requires \'device-id\''),
  },

  NULL_USER_AGENT: {
    code: 403,
    error: new Error('Operation requires \'user-agent\''),
  },

  /* Conflicts */
  SIGN_IN: {
    code: 500,
    error: new Error('Couldn\'t sign you in'),
  },

  SIGN_OUT: {
    code: 500,
    error: new Error('Couldn\'t sign you out'),
  },

  USER_EXISTS: {
    code: 409,
    error: new Error('User already exists'),
  },

  /**
   * Forbidden fields update error generator
   * @param {Array<string>} fields Error instance
   */
  FORBIDDEN_FIELDS_ERROR: (fields) => ({
    code: 406,
    error: new Error(`Forbidden fields present: ${fields.join(', ')}`),
  }),

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
    error,
  }),
};
