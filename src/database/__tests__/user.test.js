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

describe("Testing User model", () => {
    
    it("must throw invalid email address error", () => {
        expect(User.model.create({
            email: "dummy@dummy.",
            password: "#@!Qwerdfc1204",
            phone: "+919233239087",
            address: "qwert, gjfkslcmvn - 904459"
        }))
        .rejects
        .toThrowError("Invalid email address");
    });

    it("must throw weak password error", () => {
        expect(User.model.create({
            email: "dummy@dummy.com",
            password: "#1204",
            phone: "+919233239087",
            address: "qwert, gjfkslcmvn - 904459"
        }))
        .rejects
        .toThrowError("Weak password");
    });

    it("must throw invalid phone number error", () => {
        expect(User.model.create({
            email: "dummy@dummy.com",
            password: "#@!Qwerdfc1204",
            phone: "+91233239087",
            address: "qwert, gjfkslcmvn - 904459"
        }))
        .rejects
        .toThrowError("Invalid phone number");
    });
});