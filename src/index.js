const { createServer } = require('http');
const express = require('express');
const { config } = require('dotenv');
const yargs = require('yargs');
const { connect } = require('mongoose');
const { constants, smsServer } = require('./utils');
const {
  UserRouter, DoctorRouter, FamilyRouter, ServiceRouter, AppointmentRouter, LocationRouter,
} = require('./routes');

const App = express();
App.use(UserRouter);
App.use(DoctorRouter);
App.use(FamilyRouter);
App.use(ServiceRouter);
App.use(AppointmentRouter);
App.use(LocationRouter);

const argv = yargs(process.argv.slice(2))
  .options({
    /**
     * --development option sets up environment values for testing
     */
    development: {
      describe: 'Run in development environment',
      boolean: true,
    },
    /**
     * --rtengine opens up a socket server for SM SMSB Android client to connect (experimental)
     */
    rtengine: {
      describe: 'Enable realtime analytics & services',
      boolean: true,
    },
    /**
     * --dashboard sets up a dashboard to be served
     */
    // dashboard:  {
    //     describe: "Enable server dashboard",
    //     boolean: true
    // }
  })
  .parse();

// Inject test values into runtime environment
if (argv.development) {
  config({ path: '.env' });
}

process.stdout.write('- Connecting to mongodb');
connect(constants.mongoUri(), {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((connection) => {
  process.stdout.write(`: mongodb v.${connection.version} online\n`);

  process.stdout.write('- setting up listener');
  const server = createServer(App);
  server.listen(constants.port(), () => {
    process.stdout.write(`: listening on PORT ${constants.port()}\n`);

    if (argv.rtengine) {
      process.stdout.write('- setting up socket listener');
      smsServer.setSocketServer(server);
      process.stdout.write(': socket listener is up\n');
    }
  });
});

module.exports = App;
