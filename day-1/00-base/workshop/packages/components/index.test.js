const m = require("./index");

describe("common / index", () => {
    it("should contain common", () => {
        expect(m).toEqual({ moduleName: "@workspace/components" });
    });
});