/* eslint-disable no-console */
const { createServer } = require('http');
const express = require('express');
const { config } = require('dotenv');
const yargs = require('yargs');
const { connect } = require('mongoose');
const { constants } = require('./utils');
const { UserRouter, DoctorRouter, FamilyRouter, ServiceRouter } = require('./routes');
const { otpServer } = require('./utils');

const App = express();
App.use(express.json());
App.use(UserRouter);
App.use(DoctorRouter);
App.use(FamilyRouter);
App.use(ServiceRouter)
const server = createServer(App);

const argv = yargs(process.argv.slice(2))
  .options({
    development: {
      describe: 'Run in development environment',
      boolean: true,
    },
    rtengine: {
      describe: 'Enable realtime analytics & services',
      boolean: true,
    },
    // dashboard:  {
    //     describe: "Open dashboard in browser",
    //     boolean: true
    // }
  })
  .parse();

if (argv.development) {
  config({ path: '.env' });
}

console.log('[+] connecting to mongodb');
connect(constants.mongoUri(), {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => {
    console.log(`[*] mongodb v.${connection.version} online\n`);

    console.log('[+] setting up listener');
    server.listen(constants.port(), () => {
      console.log(`[*] listening on PORT ${constants.port()}\n`);

      if (argv.rtengine) {
        console.log('[+] setting up socket listener');
        otpServer.setSocketServer(server);
        console.log('[*] socket listener is up\n');
      }

      // if (argv.dashboard) {
      //     console.log("[+] firing up default browser");
      //     open(`http://127.0.0.1:${Environment.PORT()}/dashboard`, {
      //         wait: false
      //     }).then(() => {
      //         console.log(`[*] dashboard is up\n`);
      //     }).catch(error => {
      //         console.log(`[x] failed to open dashboard\n`);
      //         console.error(error);
      //     });
      // }
    });
  });
