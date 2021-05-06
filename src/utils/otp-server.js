const { Server: HttpServer } = require('http');
const { Server } = require('socket.io');
const speakeasy = require('speakeasy');

/**
 * OTP server instance holder
 */
const sServer = new Server();

/**
 * Set the socket server instance globally
 * @param {Server} server Socket server instance
 */
function setSocketServer(server) {
  if (!(server instanceof HttpServer)) {
    throw new Error('Not a Socket server instance');
  }
  sServer.attach(server, { path: '/otp-service' });
}

/**
 * Generates OTP based on `secret` and emits socket event to `phone`
 * @param {string} phone Phone address to send OTP to
 * @param {string} secret Base64 secret key for OTP generation
 * @returns {Promise<void>}
 */
function sendCode(phone, secret) {
  return new Promise((resolve, reject) => {
    try {
      const otp = speakeasy.totp({
        secret,
        encoding: 'base32',
        digits: 6,
      });
      sServer.emit('send otp', { phone, code: otp });
      resolve();
    } catch (error) {
      reject(new Error('Couldn\'t send OTP'));
    }
  });
}

/**
 * Verifies OTP `token` based on `secret`
 * @param {string} secret Base64 secret key
 * @param {string} token Phone address to send OTP to
 * @returns {boolean}
 */
function verifyCode(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 10,
  });
}

sServer.on('connection', async (socket) => {
  process.stdout.write('[*] OTP client connected\n');
  socket.on('disconnect', () => {
    process.stdout.write('[*] OTP client disconnected\n');
  });
});

module.exports = {
  server: sServer, setSocketServer, sendCode, verifyCode,
};
