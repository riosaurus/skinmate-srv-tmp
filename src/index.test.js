const message = require(".");

describe("Hello world tests", () => {
    it("must export hello world", () => {
        expect(message).toBe("Hello world");
    })
})