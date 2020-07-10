import * as T from "../task";
import { pipe } from "../utils/pipe";
import * as R from "../task/run";

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
        return T.success("handled");
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

const computation2 = () =>
  pipe(
    T.of,
    T.bind("a")(() => T.success(1)),
    T.bind("b")(() => T.success(2)),
    T.bind("c")(({ a, b }) => T.success(a + b)),
    T.map((s) => s.c),
    T.safeRun
  );

function getTracingContext() {
  const spies = [] as jest.SpyInstance<unknown>[];

  function newContext() {
    const original = R.run;
    const spy = jest.spyOn(R, "run");
    const running = new Set<Promise<any>>();
    const responses = jest.fn<void, [T.Either<unknown, unknown>]>();

    spies.push(spy);

    spy.mockImplementation(async (task) => {
      const p = original(task);
      running.add(p);
      const r = await p;
      running.delete(p);
      responses(r);
      return r;
    });

    return {
      waitRunning: () => Promise.all(Array.from(running)),
      responses,
    };
  }

  afterEach(() => {
    const clean = spies.splice(0, spies.length);

    clean.forEach((spy) => {
      spy.mockRestore();
    });
  });

  return {
    newContext,
  };
}

const TC = getTracingContext();

describe("03-track-async", () => {
  it("should track execution", async () => {
    const { waitRunning, responses } = TC.newContext();

    // this might be triggered by a running component
    computation();

    await waitRunning();
    expect(responses).toHaveBeenCalledTimes(1);
    expect(responses).toHaveBeenCalledWith(T.left("final"));
  });

  it("should track execution of multiple computations", async () => {
    const { waitRunning, responses } = TC.newContext();

    // this might be triggered by a running component
    computation();
    computation2();

    await waitRunning();
    expect(responses).toHaveBeenCalledTimes(2);
    expect(responses).toHaveBeenNthCalledWith(1, T.right(3));
    expect(responses).toHaveBeenNthCalledWith(2, T.left("final"));
  });
});
