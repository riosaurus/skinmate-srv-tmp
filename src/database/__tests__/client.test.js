const { Client } = require('..');

describe("Unit tests for Client model", () => {

    it("Must create a client model", () => {
        const client = new Client.model({ userAgent: "Netscape" });
        expect(client.userAgent).toBe("Netscape");
    })
})