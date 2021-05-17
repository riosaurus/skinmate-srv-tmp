/* eslint-disable no-console */
const validator = require('validator');
const { Client, User } = require('../database');
const errors = require('./errors');

/**
 * Allows next operations only if specified headers exists in the request.
 * ***
 * * Use `requireHeaders` middleware to ensure `device-id` and `access-token` presence
 * * Automatically verifies device registration.
 * ***
 * ### Possible errors
 * | Code | Message |
 * | ---: | :------ |
 * | `401`  | Operation requires `access-token` |
 * | `403`  | Operation requires `device-id` |
 * | `403`  | Operation requires `user-agent` |
 * ***
 * @param {{accessToken: boolean, deviceId: boolean, userAgent: boolean}} params
 * @returns {RequestHandler} express middleware
 */
function requireHeaders({ accessToken, deviceId, userAgent }) {
  return (request, response, next) => {
    try {
      if (accessToken && !request.headers['access-token']) {
        response.status(errors.NULL_ACCESS_TOKEN.code);
        throw errors.NULL_ACCESS_TOKEN.error;
      }
      if (deviceId && !request.headers['device-id']) {
        response.status(errors.NULL_DEVICE_ID.code);
        throw errors.NULL_DEVICE_ID.error;
      }
      if (userAgent && !request.headers['user-agent']) {
        response.status(errors.NULL_USER_AGENT.code);
        throw errors.NULL_USER_AGENT.error;
      }
      next();
    } catch (error) {
      response.send(error.message);
    }
  };
}

/**
 * Allows next operations only if request body isn't empty.
 * ***
 * ### Possible errors
 * | Code | Message |
 * | ---: | :------ |
 * | `400`  | Request body is empty |
 * ***
 * @returns {RequestHandler} express middleware
 */
function requireBody() {
  return (request, response, next) => {
    try {
      if (Object.entries(request.body).length === 0) {
        response.status(errors.NULL_REQUEST_BODY.code);
        throw errors.NULL_REQUEST_BODY.error;
      }
      next();
    } catch (error) {
      response.send(error.message);
    }
  }
}

/**
 * Allows next operations only on communication medium verification.
 * ***
 * * Use `requireHeaders` middleware to ensure `device-id` and `access-token` presence
 * * Automatically verifies device registration.
 * ***
 * ### Possible errors
 * | Code | Message |
 * | ---: | :------ |
 * | `500`  | Couldn\'t verify your identity |
 * | `500`  | Couldn\'t find user |
 * | `401`  | Unauthorized client |
 * | `401`  | Operation requires elevated privileges |
 * | `401`  | Phone and email not verified |
 * | `401`  | Phone number not verified |
 * | `401`  | Email not verified |
 * | `403`  | Incomplete profile (incomplete fields) |
 * ***
 * @param {{phone: boolean, email: boolean, admin: boolean}} params Comms to verify
 * @returns {RequestHandler} express middleware
 */
function requireVerification({
  phone, email, profile, admin,
}) {
  return async (request, response, next) => {
    try {
      // Get the client document
      const client = await Client.findOne({
        _id: request.headers['device-id'],
        token: request.headers['access-token'],
        isDeleted: { $ne: true },
      }).catch((error) => {
        console.error(error);
        response.status(errors.FIND_CLIENT_FAILED.code);
        throw errors.FIND_CLIENT_FAILED.error;
      });

      // Check if client exist
      if (!client) {
        response.status(errors.NULL_CLIENT.code);
        throw errors.NULL_CLIENT.error;
      }

      if (!(await client.isValid())) {
        response.status(errors.INVALID_ACCESS_TOKEN.code);
        throw errors.INVALID_ACCESS_TOKEN.error;
      }

      // Check user verification status
      const user = await User.findOne({
        clients: client.id,
        isDeleted: { $ne: true },
      })
        .catch((error) => {
          console.error(error);
          response.status(errors.FIND_USER_FAILED.code);
          throw errors.FIND_USER_FAILED.error;
        });

      if (!user) {
        response.status(errors.NULL_USER.code);
        throw errors.NULL_USER.error;
      }

      // Hydrate `request.params` with userId
      request.params.userId = user.id;

      if (admin && !user.elevatedAccess) {
        response.status(errors.NO_ELEVATED_ACCESS.code);
        throw errors.NO_ELEVATED_ACCESS.error;
      }

      if (phone && email && !user.verifiedPhone && !user.verifiedEmail) {
        response.status(errors.PHONE_EMAIL_UNVERIFIED.code);
        throw errors.PHONE_EMAIL_UNVERIFIED.error;
      }

      if (phone && !user.verifiedPhone) {
        response.status(errors.PHONE_UNVERIFIED.code);
        throw errors.PHONE_UNVERIFIED.error;
      }

      if (email && !user.verifiedEmail) {
        response.status(errors.EMAIL_UNVERIFIED.code);
        throw errors.EMAIL_UNVERIFIED.error;
      }

      if (profile) {
        const userObject = user.toJSON();
        const keys = Object.keys(userObject);
        const expected = ['firstName', 'lastName', 'password', 'gender', 'dateOfBirth', 'bloodGroup', 'address', 'insurance', 'emergencyName', 'emergencyNumber'];
        const allow = keys.every((key) => expected.includes(key)
        && !validator.default.isEmpty(userObject[key]));
        if (!allow) {
          const { code, error } = errors.INCOMPLETE_PROFILE(keys
            .filter((key) => !expected.includes(key)));
          response.status(code);
          throw error;
        }
      }

      next();
    } catch (error) {
      response.send(error.message);
    }
  };
}

module.exports = { requireHeaders, requireBody, requireVerification };
