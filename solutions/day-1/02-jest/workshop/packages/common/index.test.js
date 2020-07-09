const m = require("./index")

describe("common / index", () => {
    it("should contain common", () => {
        expect(m).toStrictEqual({ module: "common" })
    })
})