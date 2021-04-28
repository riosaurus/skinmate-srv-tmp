const { config } = require('dotenv');
const { connect } = require('mongoose');
const { Environment } = require('../../utils');
const { User } = require('..');

let database;

beforeAll(async () => {
    config({ path: ".test.env" });
    database = await connect(Environment.MONGO_URI(), { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await User.model.deleteMany();
    await database.connection.close();
});

describe("Unit tests for User model", () => {

    const dummyUser = {
        email: "dummy@dummy.com",
        phone: "+919191919191",
        password: "#$Strong^20Password",
        name: "Dumb Dummy",
        address: "#1-100/1, Dummy Residence, Dummy Town - 000001",
        userAgent: "SomeImaginaryDevice"
    };
    
    it("Must register user", () => {
        expect(User.model.create(dummyUser))
            .resolves;
    });
});