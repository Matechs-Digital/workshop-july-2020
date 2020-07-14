import { KeyValueStore, useKV, keyValueStore } from "./02-mocking";
import * as KV from "./02-mocking";
import { useMainKV } from "./02-useMainKV";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("02-mocking", () => {
  /**
   * A stub is an object that resembles a real object with the minimum number of methods needed for a test.
   * A stub is referred to as the lightest, and the most static version of the test doubles.
   */

  /**
   * Exercise 1
   */
  it("asserts useKV(kv) returns kv.get(2) using a stub", () => {
    const f = jest.fn();
    const p: KeyValueStore = {
      put: () => {
        //
      },
      get: (k) => {
        if (k === 2) {
          f();
          return 0;
        }
        throw new Error("bug in useKV");
      },
    };
    expect(useKV(p));
    expect(f).toHaveBeenCalledTimes(1);
  });

  /**
   * Spies are known as partially mock objects. It means spy creates a partial object or a half dummy
   * of the real object by stubbing or spying the real ones. In spying, the real object remains unchanged,
   * and we just spy some specific methods of it. In other words, we take the existing (real) object
   * and replace or spy only some of its methods.
   */

  /**
   * Exercise 2
   */
  it("asserts useKV(kv) returns kv.get(2) using a spy", () => {
    const f = [] as [number, number | undefined][];
    const kv = keyValueStore();
    const spy: KeyValueStore = {
      ...kv,
      get: (k) => {
        const r = kv.get(k);
        f.push([k, r]);
        return r;
      },
    };

    expect(useKV(spy)).toBe(3);
    expect(f).toEqual([[2, 3]]);
  });

  /**
   * Fakes are fully functional replacements of the objects
   */

  /**
   * Exercise 3
   */
  it("asserts useKV(kv) returns kv.get(2) using a fake", () => {
    const s = new Map<number, number>();
    const kv: KeyValueStore = {
      get: (k) => s.get(k),
      put: (k, v) => {
        s.set(k, v);
      },
    };

    expect(useKV(kv)).toBe(s.get(2));
  });

  /**
   * Exercise 4
   */
  it("asserts useKV(kv) is calling put correctly using a fake", () => {
    const s = new Map<number, number>();
    const kv: KeyValueStore = {
      get: (k) => s.get(k),
      put: (k, v) => {
        s.set(k, v);
      },
    };

    expect(useKV(kv));
    expect(Array.from(s)).toEqual([
      [0, 1],
      [1, 2],
      [2, 3],
    ]);
  });

  /**
   * Exercise 5
   */
  it("asserts using useMainKV() is calling put correctly using a jest spy", () => {
    const original = KV.keyValueStore;
    const spy = jest.spyOn(KV, "keyValueStore");
    const f = jest.fn();
    spy.mockImplementation(() => {
      const kv = original();
      return {
        ...kv,
        put: (k, v) => {
          f(k, v);
          return kv.put(k, v);
        },
      };
    });
    expect(useMainKV());
    expect(f).toHaveBeenNthCalledWith(1, 0, 1);
    expect(f).toHaveBeenNthCalledWith(2, 1, 2);
    expect(f).toHaveBeenNthCalledWith(1, 2, 3);
  });
});
