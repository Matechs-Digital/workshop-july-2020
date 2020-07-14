import { useKV, KeyValueStore, keyValueStore } from "./02-mocking";
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
    const kv: KeyValueStore = {
      get: (n) => {
        if (n === 2) {
          return 0;
        } else {
          throw new Error("implementation error");
        }
      },
      put: () => {
        //
      },
    };
    expect(useKV(kv)).toBe(0);
  });

  it("asserts useKV(kv) puts kv.put(0, 1) and more using a stub", () => {
    const f = jest.fn();
    const kv: KeyValueStore = {
      get: () => {
        return 0;
      },
      put: (k, v) => {
        f(k, v);
        //
      },
    };
    expect(useKV(kv)).toBe(0);
    expect(f).toHaveBeenCalledWith(0, 1);
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
    const kv = keyValueStore();
    const spy = (kv: KeyValueStore): KeyValueStore => {
      return {
        ...kv,
        get: (n) => {
          if (n !== 2) {
            throw new Error("bug");
          }
          return kv.get(0);
        },
      };
    };

    expect(useKV(spy(kv))).toBe(1);
  });

  /**
   * Fakes are fully functional replacements of the objects
   */

  /**
   * Exercise 3
   */
  it("asserts useKV(kv) returns kv.get(2) using a fake", () => {
    const store = new Map<number, number>();
    const kv: KeyValueStore = {
      put: (k: number, v: number) => {
        store.set(k, v);
      },
      get: (n: number) => {
        return store.get(n);
      },
    };
    expect(useKV(kv)).toBe(store.get(2));
  });

  /**
   * Exercise 4
   */
  it("asserts useKV(kv) is calling put correctly using a fake", () => {
    const store = new Map<number, number>();
    const kv: KeyValueStore = {
      put: (k: number, v: number) => {
        store.set(k, v);
      },
      get: (n: number) => {
        return store.get(n);
      },
    };
    useKV(kv);
    expect(Array.from(store)).toEqual([
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
          kv.put(k, v);
        },
      };
    });
    useMainKV();
    expect(f).toHaveBeenCalledTimes(3);
    expect(f).toHaveBeenNthCalledWith(1, 0, 1);
    expect(f).toHaveBeenNthCalledWith(2, 1, 2);
    expect(f).toHaveBeenNthCalledWith(3, 2, 3);
  });
});
