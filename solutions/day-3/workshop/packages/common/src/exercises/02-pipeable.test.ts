import { final, finalP } from "./02-pipeable";

describe("02-pipeable-test", () => {
  /**
   * Exercise
   */
  it("final === finalP", () => {
    expect(final).toEqual(finalP);
  });
});
