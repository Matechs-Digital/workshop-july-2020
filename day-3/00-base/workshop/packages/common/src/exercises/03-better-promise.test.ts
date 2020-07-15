import { pipe } from "./01-pipe";
import * as T from "./03-better-promise";

describe("03-better-promise", () => {
  /**
   * Exercise 1
   */
  it("test sync", async () => {
    const res = await pipe(
      T.sync(() => 1),
      T.runPromise
    );

    expect(res).toEqual(T.success(1));
  });

  /**
   * Exercise 1
   */
  it("test succeed", async () => {
    const res = await pipe(T.succeed(1), T.runPromise);

    expect(res).toEqual(T.success(1));
  });

  /**
   * Exercise 2
   */
  it("test fail", async () => {
    const res = await pipe(T.fail("failed"), T.runPromise);

    expect(res).toEqual(T.failure("failed"));
  });

  /**
   * Exercise 3
   */
  it("test fromPromise", async () => {
    class MyError {
      readonly _tag = "MyError";

      constructor(readonly message: string) {}
    }
    const timeoutError = T.fromPromise((u) => new MyError(u as string))(
      () =>
        new Promise<never>((_, r) => {
          setTimeout(() => {
            r("error");
          }, 100);
        })
    );

    const res = await pipe(timeoutError, T.runPromise);

    expect(res).toEqual(T.failure(new MyError("error")));
  });

  /**
   * Exercise 4
   */
  it("test fromTryCatch", async () => {
    class MyError {
      readonly _tag = "MyError";

      constructor(readonly message: string) {}
    }
    const timeoutError = T.fromTryCatch((u) => new MyError(u as string))(() => {
      throw "error";
    });

    const res = await pipe(timeoutError, T.runPromise);

    expect(res).toEqual(T.failure(new MyError("error")));
  });

  /**
   * Exercise 5
   */
  it("test fromNonFailingPromise", async () => {
    const program = T.fromNonFailingPromise(
      () =>
        new Promise<number>((r) => {
          r(1);
        })
    );

    const res = await pipe(program, T.runPromise);

    expect(res).toEqual(T.success(1));
  });

  /**
   * Exercise 6
   */
  it("test fromCallback", async () => {
    const program = T.fromCallback<never, number>((res) => {
      setTimeout(() => {
        res(1);
      }, 100);
    });

    const res = await pipe(program, T.runPromise);

    expect(res).toEqual(T.success(1));
  });

  /**
   * Exercise 7
   */
  it("test headless running and tracing", async () => {
    T.tracingContext.clear();

    const program = T.fromCallback<never, number>((res) => {
      setTimeout(() => {
        res(1);
      }, 100);
    });

    pipe(program, T.runPromise);

    const results = await T.tracingContext.wait();

    expect(results).toEqual([T.success(1)]);
  });

  /**
   * Exercise 8
   */
  it.todo("test headless running and tracing in failing conditions");

  /**
   * Exercise 9
   */
  it("test chain", async () => {
    const add1 = (n: number): T.Task<never, number> =>
      T.sync(() => {
        return n + 1;
      });

    const res = await pipe(T.succeed(1), T.chain(add1), T.runPromise);

    expect(res).toEqual(T.success(2));
  });
  it("test chain 2", async () => {
    class HttpError {
      readonly _tag = "HttpError";
    }
    class JsonError {
      readonly _tag = "JsonError";
    }

    const doHttpCall = (_: string) =>
      T.fromTryCatch(() => new HttpError())(() =>
        JSON.stringify({ foo: "bar" })
      );

    const jsonDecode = (body: string) =>
      T.fromTryCatch(() => new JsonError())(() => JSON.parse(body) as unknown);

    const program = pipe(
      doHttpCall("http://example.com/api"),
      T.chain(jsonDecode)
    );

    const res = await pipe(program, T.runPromise);

    expect(res).toEqual(T.success({ foo: "bar" }));
  });

  /**
   * Exercise 10
   */
  it.todo("test headless running and tracing in interruption conditions");

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
  it("test handle", async () => {
    class ReasonA {
      readonly _tag = "ReasonA";
    }
    class ReasonB {
      readonly _tag = "ReasonB";
    }
    class ReasonC {
      readonly _tag = "ReasonC";
    }

    const res = pipe(
      T.sequence(
        T.succeed(1),
        T.fail(new ReasonA()),
        T.fail(new ReasonB()),
        T.fail(new ReasonC())
      ),
      T.handle((e) => {
        switch (e._tag) {
          case "ReasonA": {
            return T.sync(() => {
              return [];
            });
          }
          default: {
            return T.fail(e);
          }
        }
      })
    );
  });

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
  it("test bind", () => {
    const res = pipe(
      T.of,
      T.bind("a")(() => T.succeed(1)),
      T.bind("b")(() => T.fail("error" as const)),
      T.bind("c")(({ a, b }) => T.succeed(a + b)),
      T.map(({ c }) => c)
    );

    async function f() {
      try {
        const a = await new Promise((r) => {
          r(1);
        });
        const b = await new Promise((r) => {
          r(1);
        });
      } catch (e) {}
    }
  });

  /**
   * Exercise 20
   */
  it.todo("test assign");

  /**
   * Exercise 21
   */
  it.todo("test delayed");

  /**
   * Exercise 22
   */
  it.todo("test onInterrupt");

  /**
   * Exercise 23
   */
  it.todo("test fromInterruptibleCallback");
});
