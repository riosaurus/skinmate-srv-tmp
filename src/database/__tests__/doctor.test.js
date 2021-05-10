const { connect } = require('mongoose');
const { config } = require('dotenv');
const { Environment } = require('../../utils');
const { Doctor } = require('..');

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
  await Doctor.deleteMany();
  await database.connection.close();
});

describe('Testing doctor creation', () => {
  it('Validate the document', async () => {
    const doctor = new Doctor({
      //doctor document
      name:"PVbhat",
      email:"pvbhat@gmail.com",
      phone:"+91999999999",
      qualifiaction:"MBBS"
    });
    // Save the doctor
    await doctor.save();
  });
});