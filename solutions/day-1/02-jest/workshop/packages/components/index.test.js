const m = require("./index")

describe("components / index", () => {
    it("should contain components", () => {
        expect(m).toStrictEqual({ module: "components" })
    })
})