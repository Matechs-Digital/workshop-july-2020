import * as T from "../task";
import { pipe } from "../utils/pipe";
import { newTestContext } from "../task/tracing";

async function computation() {
  return await pipe(
    T.fromNonFailingPromise(
      () =>
        new Promise<number>((res) => {
          setTimeout(() => {
            res(1);
          }, 1000);
        })
    ),
    T.map((n) => n + 1),
    T.map((n) => n + 2),
    T.chain(() => T.fail("error")),
    T.handle((e) => {
      if (e.length > 2) {
        return T.succeed("handled");
      } else {
        return T.fail(0);
      }
    }),
    T.chain((a) =>
      T.fromTryCatch(() => "final")(() => {
        if (a === "handled") {
          throw new Error("throwed");
        } else {
          return a;
        }
      })
    ),
    T.run
  );
}

const computation2 = pipe(
  T.of,
  T.tap(() =>
    T.fromNonFailingPromise(
      () =>
        new Promise<number>((res) => {
          setTimeout(() => {
            res(1);
          }, 1000);
        })
    )
  ),
  T.bind("a")(() => T.succeed(1)),
  T.bind("b")(() => T.succeed(2)),
  T.bind("c")(({ a, b }) => T.succeed(a + b)),
  T.bind("all")(({ a, b, c }) =>
    T.sequence(T.succeed(a), T.succeed(b), T.succeed(c))
  ),
  T.map((s) => s.all),
  T.runAsync
);

describe("03-track-async", () => {
  it("should track execution", async () => {
    const { waitRunning, responses } = newTestContext();

    // this might be triggered by a running component
    computation();

    await waitRunning();
    expect(responses).toHaveBeenCalledTimes(1);
    expect(responses).toHaveBeenCalledWith(T.failure("final"));
  });

  it("should track execution of multiple computations", async () => {
    const { waitRunning, responses } = newTestContext();

    // this might be triggered by a running component
    computation();
    computation2();

    await waitRunning();
    expect(responses).toHaveBeenCalledTimes(2);
    expect(responses).toHaveBeenNthCalledWith(2, T.success([1, 2, 3]));
    expect(responses).toHaveBeenNthCalledWith(1, T.failure("final"));
  });

  it("should interrupt", async () => {
    const { waitRunning, responses } = newTestContext();

    // this might be triggered by a running component
    const cancel = computation2();

    setTimeout(() => {
      cancel();
    }, 100);

    await waitRunning();
    expect(responses).toHaveBeenCalledTimes(1);
    expect(responses).toHaveBeenNthCalledWith(1, T.interrupt);
  });
});
