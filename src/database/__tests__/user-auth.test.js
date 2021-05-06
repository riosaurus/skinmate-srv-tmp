/* eslint-disable no-undef */
const { connect } = require('mongoose');
const { config } = require('dotenv');
const { Environment } = require('../../utils');
const { User, Client } = require('..');

let database;

beforeAll(async () => {
  config({ path: '.test.env' });
  database = await connect(Environment.mongoUri(), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await User.deleteMany();
  await database.connection.close();
});

describe('Testing user authentication', () => {
  it('Step 1: Validate the document', async () => {
    // Prepare the user document
    const user = new User({
      email: 'dummy@dummy.com',
      password: '!@#334TummySmall',
      phone: '+919990084758',
      address: 'fjvnv, nfmvkfl',
    });
    // Validate the document
    expect(user.validate()).resolves.toBeFalsy();
    // Prepare client access document
    const client = await Client.addDevice(user, 'NetscapeNav');
    // Link it to user
    await user.linkClient(client);
    // Save the user
    await user.save();
    // Return the client to user
  });
});
