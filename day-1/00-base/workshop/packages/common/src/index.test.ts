import { moduleName } from "./index";

describe("common / index", () => {
  it("should contain common", () => {
    expect(moduleName).toEqual("common");
  });
});
