const express = require('express');
const { config } = require('dotenv');
const yargs = require('yargs');
const { connect } = require('mongoose');
const { Environment } = require('./utils');

const App = express();

const argv = yargs(process.argv.slice(2))
    .options({
        development: {
            describe: "Run in development environment",
            boolean: true
        },
        // dashboard:  {
        //     describe: "Open dashboard in browser",
        //     boolean: true
        // }
    })
    .parse();

config({ path: argv.development ? ".env" : ".env.test" });

process.stdout.write("[+] connecting to mongodb");
connect(Environment.MONGO_URI(), { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(connection => {
        process.stdout.clearLine(-1);
        process.stdout.cursorTo(0);
        process.stdout.write(`[*] connected to mongodb v.${connection.version}\n`);

        process.stdout.write("[+] setting up listener")
        App.listen(Environment.PORT(), () => {
            process.stdout.clearLine(-1);
            process.stdout.cursorTo(0);
            process.stdout.write(`[*] listening on PORT ${Environment.PORT()}\n`);

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