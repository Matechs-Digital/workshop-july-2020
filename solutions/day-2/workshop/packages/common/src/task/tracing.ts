import * as T from "../task";
import * as R from "../task/run";

export function getTracingContext() {
  const spies = [] as jest.SpyInstance<unknown>[];

  function newTestContext() {
    const original = R.runInterruptiblePromise;
    const spy = jest.spyOn(R, "runInterruptiblePromise");
    const running = new Set<Promise<any>>();
    const responses = jest.fn<void, [T.Exit<unknown, unknown>]>();

    spies.push(spy);

    spy.mockImplementation(async (task) => {
      const p = original(task);
      running.add(p);
      try {
        const r = await p;
        responses(r);
        return r;
      } catch (e) {
        responses(e);
        throw e;
      } finally {
        running.delete(p);
      }
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
    newTestContext,
  };
}
