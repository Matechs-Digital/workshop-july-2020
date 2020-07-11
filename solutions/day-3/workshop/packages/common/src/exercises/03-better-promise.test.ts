import { pipe } from "./01-pipe";
import * as T from "./03-better-promise";

describe("03-better-promise", () => {
  /**
   * Exercise 1
   */
  it("test sync", async () => {
    const result = await pipe(
      T.sync(() => {
        return 1;
      }),
      T.runPromise
    );

    expect(result).toEqual(T.success(1));
  });

  /**
   * Exercise 1
   */
  it.todo("test succeed + of");

  /**
   * Exercise 2
   */
  it.todo("test fail");

  /**
   * Exercise 3
   */
  it("test fromPromise", async () => {
    const fromPromise = T.fromPromise((u) =>
      u instanceof Error ? u.message : "Unexpected"
    );

    const result = await pipe(
      fromPromise(() => Promise.resolve(1)),
      T.runPromise
    );

    const result2 = await pipe(
      fromPromise(() => Promise.reject(1)),
      T.runPromise
    );

    const result3 = await pipe(
      fromPromise(() => Promise.reject(new Error("Task Error"))),
      T.runPromise
    );

    expect(result).toEqual(T.success(1));
    expect(result2).toEqual(T.failure("Unexpected"));
    expect(result3).toEqual(T.failure("Task Error"));
  });

  /**
   * Exercise 4
   */
  it.todo("test fromTryCatch");

  /**
   * Exercise 5
   */
  it.todo("test fromNonFailingPromise");

  /**
   * Exercise 6
   */
  it.todo("test fromCallback");

  /**
   * Exercise 7
   */
  it("test headless running and tracing", async () => {
    T.tracingContext.clear();

    const f = jest.fn();

    pipe(
      T.fromNonFailingPromise(
        () =>
          new Promise((r) => {
            setTimeout(() => {
              f();
              r(1);
            }, 1000);
          })
      ),
      T.runPromise
    );

    const results = await T.tracingContext.wait();

    expect(f).toHaveBeenCalledTimes(1);

    expect(results).toEqual([T.success(1)]);
  });

  /**
   * Exercise 8
   */
  it("test headless running and tracing in failing conditions", async () => {
    T.tracingContext.clear();

    const f = jest.fn();

    pipe(
      T.fromPromise((u) => u as number)(
        () =>
          new Promise((_, r) => {
            setTimeout(() => {
              f();
              r(1);
            }, 1000);
          })
      ),
      T.runPromise
    );

    const results = await T.tracingContext.wait();

    expect(f).toHaveBeenCalledTimes(1);

    expect(results).toEqual([T.failure(1)]);
  });

  /**
   * Exercise 9
   */
  it.todo("test chain");

  /**
   * Exercise 10
   */
  it("test headless running and tracing in interruption conditions", async () => {
    T.tracingContext.clear();

    const f = jest.fn();
    const g = jest.fn();
    const h = jest.fn();

    const cancel = pipe(
      T.fromNonFailingPromise(
        () =>
          new Promise<number>((r) => {
            setTimeout(() => {
              f();
              r(1);
            }, 1000);
          })
      ),
      T.chain((n) =>
        T.sync(() => {
          g();
          return n;
        })
      ),
      T.runAsync((exit) => {
        h(exit);
      })
    );

    cancel();

    const results = await T.tracingContext.wait();

    expect(f).toHaveBeenCalledTimes(0);
    expect(g).toHaveBeenCalledTimes(0);
    expect(h).toHaveBeenCalledTimes(1);
    expect(h).toHaveBeenCalledWith(T.interrupt);

    expect(results).toEqual([T.interrupt]);
  });

  /**
   * Exercise 10
   */
  it.todo("test map");

  /**
   * Exercise 11
   */
  it.todo("test tap");

  /**
   * Exercise 12
   */
  it.todo("test map");

  /**
   * Exercise 13
   */
  it.todo("test handle");

  /**
   * Exercise 14
   */
  it.todo("test fold");

  /**
   * Exercise 15
   */
  it.todo("test result");

  /**
   * Exercise 16
   */
  it.todo("test all");

  /**
   * Exercise 17
   */
  it.todo("test sequence");

  /**
   * Exercise 18
   */
  it.todo("test foreach");

  /**
   * Exercise 19
   */
  it.todo("test bind");

  /**
   * Exercise 20
   */
  it.todo("test assign");
});
