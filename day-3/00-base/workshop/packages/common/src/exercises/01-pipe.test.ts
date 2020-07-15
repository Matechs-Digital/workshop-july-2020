import { pipe } from "./01-pipe";

describe("01-pipe", () => {
  /**
   * Exercise 1
   */
  it("pipe(a, f, g) = g(f(a))", () => {
    const f = (n: number) => n + 1;
    const g = (n: number) => n + 2;

    const r = pipe(1, f, g);

    expect(r).toBe(4);
  });

  /**
   * Exercise 2
   */
  it("cover all cases of pipe", () => {
    const args = [
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
    expect(pipe(1, ...args)).toBe(14);
  });
});
