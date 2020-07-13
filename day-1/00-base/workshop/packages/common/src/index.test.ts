import * as m from "./index";

describe("common / index", () => {
  it("should contain common", () => {
    expect(m.module).toStrictEqual("common");
  });
});
