/* eslint-disable no-console */
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
        response.status(errors.NO_ACCESS_TOKEN.code);
        throw errors.NO_ACCESS_TOKEN.error;
      }
      if (deviceId && !request.headers['device-id']) {
        response.status(errors.NO_DEVICE_ID.code);
        throw errors.NO_DEVICE_ID.error;
      }
      if (userAgent && !request.headers['user-agent']) {
        response.status(errors.NO_USER_AGENT.code);
        throw errors.NO_USER_AGENT.error;
      }
      next();
    } catch (error) {
      response.send(error.message);
    }
  };
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
 * | `401`  | Phone and email not verified |
 * | `401`  | Phone number not verified |
 * | `401`  | Email not verified |
 * ***
 * @param {{phone: boolean, email: boolean}} params Comms to verify
 * @returns {RequestHandler} express middleware
 */
function requireVerification({ phone, email }) {
  return async (request, response, next) => {
    try {
      // Get the client document
      const client = await Client.findOne({
        _id: request.headers['device-id'],
        token: request.headers['access-token'],
      }).catch((error) => {
        console.error(error);
        response.status(errors.FIND_CLIENT.code);
        throw errors.FIND_CLIENT.error;
      });

      // Check client validity
      if (!client) {
        response.status(errors.NO_CLIENT.code);
        throw new Error(errors.NO_CLIENT.error);
      }

      // Check user verification status
      const user = await User.findOne({
        _id: client.user,
        isDeleted: { $ne: true },
      })
        .catch((error) => {
          console.error(error);
          response.status(errors.FIND_USER.code);
          throw errors.FIND_USER.error;
        });

      if (!user) {
        response.status(errors.NO_USER.code);
        throw new Error(errors.NO_USER.error);
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

      next();
    } catch (error) {
      response.send(error.message);
    }
  };
}

module.exports = { requireHeaders, requireVerification };
