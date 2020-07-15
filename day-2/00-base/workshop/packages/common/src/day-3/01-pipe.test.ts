import { pipe } from "./01-pipe";

describe("01-pipe", () => {
  /**
   * Exercise 1
   */
  it("pipe(a, f, g) = g(f(a))", () => {
    expect(
      pipe(
        1,
        (n) => n + 1,
        (n) => `${n + 2}`,
        (s) => s.length
      )
    ).toBe(1);
  });

  /**
   * Exercise 2
   */
  it("cover all cases of pipe", () => {
    const fns = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
    ].map(() => (n: number) => n + 1);

    // @ts-expect-error
    expect(pipe(1, ...fns)).toBe(14);
  });
});
