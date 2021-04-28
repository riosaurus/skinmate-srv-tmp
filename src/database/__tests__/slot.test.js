const { config } = require('dotenv');
const { connect } = require('mongoose');
const { Environment } = require('../../utils');
const { Slot } = require('..');

let database;

beforeAll(async () => {
    config({ path: ".env.test" });
    database = await connect(Environment.MONGO_URI(), { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await Slot.model.deleteMany();
    await database.connection.close();
});

describe("Unit tests for Slot model", () => {

    it("Must create a slot", () => {
        expect(Slot.model.create({  }))
            .resolves
    });
});