const { config } = require('dotenv');
const { connect } = require('mongoose');
const { Environment } = require('../../utils');
const { Client } = require('..');

let database;

beforeAll(async () => {
    config({ path: ".env.test" });
    database = await connect(Environment.MONGO_URI(), { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await Client.deleteMany();
    await database.connection.close();
});

describe("Unit tests for Client model", () => {

    const device = "SomeImaginaryDevice";
    
    it("Must register client", () => {
        expect(Client.create({ device }))
            .resolves
            .toHaveProperty("token");
    });
});