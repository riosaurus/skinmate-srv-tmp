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

config({ path: argv.development ? '.test.env' : '.env' });

process.stdout.write('[+] connecting to mongodb');
connect(constants.mongoUri(), {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => {
    process.stdout.clearLine(-1);
    process.stdout.cursorTo(0);
    process.stdout.write(`[*] mongodb v.${connection.version} online\n`);

    process.stdout.write('[+] setting up listener');
    server.listen(constants.port(), () => {
      process.stdout.clearLine(-1);
      process.stdout.cursorTo(0);
      process.stdout.write(`[*] listening on PORT ${constants.port()}\n`);

      if (argv.rtengine) {
        process.stdout.write('[+] setting up socket listener');
        otpServer.setSocketServer(server);
        process.stdout.clearLine(-1);
        process.stdout.cursorTo(0);
        process.stdout.write('[*] socket listener is up\n');
      }

      // if (argv.dashboard) {
      //     process.stdout.write("[+] firing up default browser");
      //     open(`http://127.0.0.1:${Environment.PORT()}/dashboard`, {
      //         wait: false
      //     }).then(() => {
      //         process.stdout.clearLine(-1);
      //         process.stdout.cursorTo(0);
      //         process.stdout.write(`[*] dashboard is up\n`);
      //     }).catch(error => {
      //         process.stdout.clearLine(-1);
      //         process.stdout.cursorTo(0);
      //         process.stdout.write(`[x] failed to open dashboard\n`);
      //         console.error(error);
      //     });
      // }
    });
  });
