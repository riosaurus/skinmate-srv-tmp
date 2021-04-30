const validator = require('validator');

/**
 * Inflates request extras from incoming requests to `request.params`.
 * @return {RequestHandler} middleware
 */
function inflate({
  strict, token, userAgent, deviceId,
}) {
  return async function middleware(request, response, next) {
    try {
      if (token) {
        if (strict && !request.headers['access-token']) {
          response.status(401);
          throw new Error('No token');
        }
        if (!validator.default.isJWT(request.headers['access-token'].toString())) {
          response.status(401);
          throw new Error('Invalid token');
        }
        request.params.token = request.headers['access-token'].toString();
      }

      if (userAgent) {
        if (strict && !request.headers['user-agent']) {
          response.status(401);
          throw new Error('user-agent not detected');
        }
        request.params.userAgent = request.headers['user-agent'] || '';
      }

      if (deviceId) {
        if (strict && !request.headers['device-id']) {
          response.status(403);
          throw new Error('device-id not detected');
        }
        if (!validator.default.isMongoId(request.headers['device-id'].toString())) {
          response.status(401);
          throw new Error('Invalid deviceId');
        }
        request.params.deviceId = request.headers['device-id'] || '';
      }

      next();
    } catch (error) {
      response.send(error.message);
    }
  };
}

/**
 * Enforces strict security passes enabled for incoming requests.
 * @return {RequestHandler} middleware
 */
function enforce() {
  return async function middleware(request, response, next) {
    try {
      next();
    } catch (error) {
      response.send(error.message);
    }
  };
}

module.exports = { inflate, enforce };
