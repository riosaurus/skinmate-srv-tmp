/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const DoctorsRouter = require('../Doctor');

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
  server.use(DoctorsRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Tests for /doctor', () => {
  it('must reject: unauthorized access', (done) => {
    supertest(server)
      .post('/doctors')
      .send({
        name: 'pv bhat',
        email: 'pvbhat@gmail.com',
        phone: '+919999999999',
        qualification: 'MBBS',
      })
      .expect(401, done);
  });
});
