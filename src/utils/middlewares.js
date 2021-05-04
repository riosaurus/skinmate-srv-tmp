const { Client, User } = require('../database');

/**
 * Allows next operations only if specified headers present
 * @param {{accessToken: boolean, deviceId: boolean, userAgent: boolean}} params
 * @returns {RequestHandler} express middleware
 */
function requireHeaders({ accessToken, deviceId, userAgent }) {
  return (request, response, next) => {
    try {
      if (accessToken && !request.headers['access-token']) {
        response.status(401);
        throw new Error('Operation requires \'access-token\'');
      }
      if (deviceId && !request.headers['device-id']) {
        response.status(403);
        throw new Error('Operation requires \'device-id\'');
      }
      if (userAgent && !request.headers['user-agent']) {
        response.status(403);
        throw new Error('Operation requires \'user-agent\'');
      }
      next();
    } catch (error) {
      response.send(error.message);
    }
  };
}

/**
 * Allows next operations only on communication medium verification
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
      });

      // Check client validity
      if (!client) {
        response.status(403);
        throw new Error('Unrecognized device');
      }

      // Check user verification status
      const user = await User.findById(client.user);

      if (phone && email && !user.verifiedPhone && !user.verifiedEmail) {
        response.status(401);
        throw new Error('Requires phone & email verification');
      }

      if (phone && !user.verifiedPhone) {
        response.status(401);
        throw new Error('Requires phone verification');
      }

      if (email && !user.verifiedEmail) {
        response.status(401);
        throw new Error('Requires email verification');
      }

      next();
    } catch (error) {
      response.send(error.message);
    }
  };
}

module.exports = { requireHeaders, requireVerification };
