/**
 * Inflates request extras from incoming requests to `request.params`.
 * @return {RequestHandler} middleware
 */
module.exports = function inflate({ strict, token, userAgent }) {
  return async function middleware(request, response, next) {
    try {
      if (token) {
        if (strict && !request.headers['access-token']) {
          response.status(401);
          throw new Error('No token');
        }
        request.params.token = request.headers['access-token'].toString() || '';
      }

      if (userAgent) {
        if (strict && !request.headers['user-agent']) {
          response.status(401);
          throw new Error('user-agent not detected');
        }
        request.params.userAgent = request.headers['user-agent'] || '';
      }

      next();
    } catch (error) {
      response.send(error.message);
    }
  };
};

/**
 * Enforces strict security passes enabled for incoming requests.
 * @return {RequestHandler} middleware
 */
module.exports = function enforce() {
  return async function middleware(request, response, next) {
    try {
      next();
    } catch (error) {
      response.send(error.message);
    }
  };
};
