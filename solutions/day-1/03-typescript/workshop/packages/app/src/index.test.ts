import * as app from ".";

describe("app / index", () => {
  it("should contain correct content", () => {
    expect(app.common.moduleName).toStrictEqual("@workshop/common");
    expect(app.components.moduleName).toStrictEqual("@workshop/components");
    expect(app.moduleName).toStrictEqual("@workshop/app");
  });
});
