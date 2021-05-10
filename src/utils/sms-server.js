const { Server: HttpServer } = require('http');
const { Server } = require('socket.io');
const speakeasy = require('speakeasy');
const { readFileSync } = require('fs');
const { compile } = require('handlebars');

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
 * Sends email.
 * @param {string} to
 * @param {string} subject
 * @param {string} template path
 * @param {{[key: string]: string}} context
 */
async function sendSMS(phone, template, context) {
  const hbsFile = readFileSync(template, { encoding: 'utf8' });
  const compiledTemplate = compile(hbsFile);
  const message = compiledTemplate(context);
  sServer.emit('send sms', { phone, message });
}

sServer.on('connection', async (socket) => {
  process.stdout.write('[*] OTP client connected\n');
  socket.on('disconnect', () => {
    process.stdout.write('[*] OTP client disconnected\n');
  });
});

module.exports = {
  server: sServer, setSocketServer, sendSMS, sendCode,
};
