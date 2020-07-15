import { defer, deferAsync } from "./04-defer";

describe("04-defer", () => {
  /**
   * Exercise 1
   */
  it("should defer execution", () => {
    const f = jest.fn();

    try {
      defer((runAfter) => {
        runAfter(() => {
          f();
        });
        throw new Error("thrown");
      })();
    } catch {}

    expect(f).toHaveBeenCalledTimes(1);
  });

  /**
   * Exercise 2
   */
  it("should deferAsync execution", async () => {
    const f = jest.fn();

    try {
      await deferAsync(async (runAfter) => {
        runAfter(
          () =>
            new Promise((_, r) => {
              f();
              r(new Error("thrown"));
            })
        );

        expect(1).toBe(2);
      })();
    } catch {}

    expect(f).toHaveBeenCalledTimes(1);
  });

  /**
   * Exercise 3
   */
  it(
    "use defer in test",
    defer((runAfter) => {
      runAfter(() => {
        // clear component
      });
      expect(1).toBe(1);
    })
  );

  /**
   * Exercise 4
   */
  it(
    "use deferAsync in test",
    deferAsync(async (runAfter) => {
      runAfter(async () => {
        expect(1).toBe(1);
      });
      expect(1).toBe(1);
    })
  );
});
