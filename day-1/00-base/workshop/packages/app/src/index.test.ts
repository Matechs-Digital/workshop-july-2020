import * as m from "./index";

describe("common / index", () => {
  it("should contain common", () => {
    expect(m.moduleNames).toEqual({
      common: { module: "common" },
      components: { moduleName: "components" },
    });
  });
});
