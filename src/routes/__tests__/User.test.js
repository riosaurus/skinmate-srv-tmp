/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const AccountsRouter = require('../User');

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
let mongoServer;
let server;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(
    mongoUri,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  );
  server = express();
  server.use(AccountsRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Tests for user auth workflow', () => {
  const email = 'dummyMail@dummymail.com';
  const password = '@33AbracaDabra';
  const phone = '+919922338947';

  let accessToken;
  let deviceId;

  it('must create a user', (done) => {
    supertest(server)
      .post('/accounts')
      .type('form')
      .set('user-agent', 'ddd')
      .send(`email=${email}&password=${password}&phone=${phone}`)
      .expect(201)
      .then((response) => {
        // eslint-disable-next-line no-underscore-dangle
        deviceId = response.body._id;
        accessToken = response.body.token;
        done();
      });
  });

  it('must reject with conflict', (done) => {
    supertest(server)
      .post('/accounts')
      .type('form')
      .set('user-agent', 'ddd')
      .send(`email=${email}&password=${password}&phone=${phone}`)
      .expect(409, done);
  });
});
