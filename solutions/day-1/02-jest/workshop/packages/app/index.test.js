const m = require("./index")

describe("app / index", () => {
    it("should have both modules", () => {
        expect(m).toStrictEqual({ common: { module: "common" }, components: { module: "components" } })
    })
})