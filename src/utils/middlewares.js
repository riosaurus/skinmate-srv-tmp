const { Client } = require('../database');

/**
 * Middleware to parse & enforce client security
 * @param {boolean} inflate Inflate to `request.params`
 * @default true
 * @param {boolean} verify Verify Client
 * @default false
 * @returns {RequestHandler} Express middleware
 */
function clientParser(inflate = true, verify = false, strict = true) {
  return async function middleware(request, response, next) {
    try {
      if (strict && !request.headers['access-token']) {
        response.status(401);
        throw new Error('access-token required');
      }

      if (inflate && request.headers['access-token']) {
        request.params.token = request.headers['access-token'].toString();
      }

      if (strict && !request.headers['user-agent']) {
        response.status(403);
        throw new Error('user-agent not detected');
      }

      if (inflate && request.headers['user-agent']) {
        request.params.userAgent = request.headers['user-agent'];
      }

      if (strict && !request.headers['device-id']) {
        response.status(403);
        throw new Error('device-id required');
      }

      if (inflate && request.headers['device-id']) {
        request.params.deviceId = request.headers['device-id'].toString();
      }

      if (verify) {
        const client = await Client.findOne({
          _id: request.params.deviceId,
          token: request.params.token,
        });

        // Check if client exists
        if (!client) {
          response.status(404);
          throw new Error('Client doesn\'t exist');
        }

        // Validate token
        await client.validate().catch((error) => {
          response.status(401);
          throw error;
        });

        if (inflate) {
          request.params.userId = client.user.toString();
        }
      }

      next();
    } catch (error) {
      response.send(error.message);
    }
  };
}

module.exports = { clientParser };
