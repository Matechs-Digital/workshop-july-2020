import { deferAsync, defer } from "./04-defer";

describe("04-defer", () => {
  /**
   * Exercise 1
   */
  it("should defer execution", () => {
    const m = jest.fn();
    const f = defer((runAfter) => {
      runAfter(() => {
        m();
      });
      return 1;
    });

    const res = f();

    expect(res).toBe(1);
    expect(m).toHaveBeenCalledTimes(1);
  });

  /**
   * Exercise 2
   */
  it("should deferAsync execution", async () => {
    const m = jest.fn();
    const f = deferAsync(async (runAfter) => {
      runAfter(
        () =>
          new Promise((r) => {
            setTimeout(() => {
              m();
              r();
            }, 100);
          })
      );
      return 1;
    });

    const res = await f();

    expect(res).toBe(1);
    expect(m).toHaveBeenCalledTimes(1);
  });

  /**
   * Exercise 3
   */
  it(
    "use defer in test",
    defer((runAfter) => {
      runAfter(() => {
        // cleanup
        expect(1);
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
        // cleanup
        expect(1);
      });
      expect(1).toBe(1);
    })
  );
});
