const { createServer } = require('http');
const express = require('express');
const { config } = require('dotenv');
const yargs = require('yargs');
const { connect } = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const yaml = require('yamljs');
const { constants, smsServer, emailServer } = require('./utils');
const {
  UserRouter, DoctorRouter, ServiceRouter, AppointmentRouter, LocationRouter,
} = require('./routes');

const App = express();
App.use('/accounts', UserRouter);
App.use(DoctorRouter);
App.use(ServiceRouter);
App.use(AppointmentRouter);
App.use(LocationRouter);
const swaggerDocs = yaml.load('assets/api-docs.yaml');
App.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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
      process.stdout.write('- setting up analytics');
      smsServer.setSocketServer(server);
      emailServer.init();
      process.stdout.write(': analytics is up\n');
    }
  });
});

module.exports = App;
