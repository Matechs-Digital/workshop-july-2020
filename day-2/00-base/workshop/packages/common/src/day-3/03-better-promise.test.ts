import { pipe } from "./01-pipe";
import * as T from "./03-better-promise";

describe("03-better-promise", () => {
  /**
   * Exercise 1
   */
  it("test sync", async () => {
    const result = await pipe(
      T.sync(() => {
        return "ok";
      }),
      T.runPromise
    );

    expect(result).toEqual(T.success("ok"));
  });

  /**
   * Exercise 1
   */
  it("test succeed", async () => {
    const result = await pipe(T.succeed("ok"), T.runPromise);

    expect(result).toEqual(T.success("ok"));
  });

  it("test of", async () => {
    const result = await pipe(T.of, T.runPromise);

    expect(result).toEqual(T.success({}));
  });

  /**
   * Exercise 2
   */
  it("test fail", async () => {
    class MyError extends Error {
      constructor(m: string) {
        super(m);
      }
    }
    const result = await pipe(T.fail(new MyError("error")), T.runPromise);

    expect(result).toEqual(T.failure(new MyError("error")));
  });

  /**
   * Exercise 3
   */
  it("test fromPromise", async () => {
    const messageIfErrorOrUnknown = T.fromPromise((e) =>
      e instanceof Error ? e.message : "unexpected error"
    );
    const result = await pipe(
      messageIfErrorOrUnknown(
        () =>
          new Promise<number>((r) => {
            setTimeout(() => {
              r(1);
            }, 100);
          })
      ),
      T.runPromise
    );

    expect(result).toEqual(T.success(1));
  });

  /**
   * Exercise 4
   */
  it.todo("test fromTryCatch");

  /**
   * Exercise 5
   */
  it("test fromNonFailingPromise", async () => {
    const result = await pipe(
      T.fromNonFailingPromise(
        () =>
          new Promise<number>((r) => {
            setTimeout(() => {
              r(1);
            }, 100);
          })
      ),
      T.runPromise
    );

    expect(result).toEqual(T.success(1));
  });

  /**
   * Exercise 6
   */
  it.todo("test fromCallback");

  /**
   * Exercise 7
   */
  it.todo("test headless running and tracing");

  /**
   * Exercise 8
   */
  it.todo("test headless running and tracing in failing conditions");

  /**
   * Exercise 9
   */
  it("test chain", async () => {
    class HttpError {
      readonly _tag = "HttpError";
    }
    class JsonError {
      readonly _tag = "JsonError";
    }

    const doHttpCall = (_: string) =>
      T.fromPromise(() => new HttpError())(
        () =>
          new Promise<string>((r) => {
            setTimeout(() => {
              r(JSON.stringify({ foo: "bar" }));
            }, 100);
          })
      );

    const jsonDecode = (s: string) =>
      T.fromTryCatch(() => new JsonError())(() => JSON.parse(s) as unknown);

    const program = pipe(
      doHttpCall("https://www.google.com"),
      T.chain(jsonDecode)
    );

    const result = await pipe(program, T.runPromise);

    expect(result).toEqual(T.success({ foo: "bar" }));
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
    class HttpError {
      readonly _tag = "HttpError";

      constructor(readonly message: string) {}
    }
    class JsonError {
      readonly _tag = "JsonError";
    }

    const doHttpCall = (_: string) =>
      T.fromPromise((u) => new HttpError(u as string))(
        () =>
          new Promise<string>((_, r) => {
            setTimeout(() => {
              r("unknown error");
            }, 100);
          })
      );

    const jsonDecode = (s: string) =>
      T.fromTryCatch(() => new JsonError())(() => JSON.parse(s) as unknown);

    const program = pipe(
      doHttpCall("https://www.google.com"),
      T.chain(jsonDecode),
      T.handle((e) => {
        switch (e._tag) {
          case "HttpError": {
            return T.sync(() => {});
          }
          default: {
            return T.fail(e);
          }
        }
      })
    );

    const result = await pipe(program, T.runPromise);

    expect(result).toEqual(T.success(undefined));
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
  it("test sequence", () => {
    const program = T.sequence(
      T.succeed(1),
      T.fail(2),
      T.succeed("str"),
      T.fail("error")
    );
  });

  /**
   * Exercise 18
   */
  it.todo("test foreach");

  /**
   * Exercise 19
   */
  it("test bind", async () => {
    const result = pipe(
      T.of,
      T.bind("a")(() => T.sync(() => 1)),
      T.bind("b")(() => T.sync(() => 2)),
      T.bind("c")(() => T.sync(() => 2)),
      T.map(({ a, b }) => a + b)
    );
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
