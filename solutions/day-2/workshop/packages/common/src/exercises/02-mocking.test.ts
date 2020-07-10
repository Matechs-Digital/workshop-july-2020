import { KeyValueStore, useKV, keyValueStore } from "./02-mocking";

describe("02-mocking", () => {
  /**
   * A stub is an object that resembles a real object with the minimum number of methods needed for a test.
   * A stub is referred to as the lightest, and the most static version of the test doubles.
   */

  /**
   * Exercise 1
   */
  it("asserts useKV(kv) returns kv.get(2) using a stub", () => {
    const stub: KeyValueStore = {
      put: () => {},
      get: (n: number) => {
        if (n !== 2) {
          throw new Error();
        }
        return 3;
      },
    };

    expect(useKV(stub)).toBe(3);
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
    const f = jest.fn();
    const original = keyValueStore();
    const spy: KeyValueStore = {
      ...original,
      get: (n) => {
        const res = original.get(n);

        f(n, res);

        return res;
      },
    };

    expect(useKV(spy)).toBe(3);
    expect(f).toHaveBeenCalledWith(2, 3);
  });

  /**
   * Fakes are fully functional replacements of the objects
   */

  /**
   * Exercise 3
   */
  it("asserts useKV(kv) returns kv.get(2) using a fake", () => {
    const elements = [] as Array<[number, number]>;

    const fake: KeyValueStore = {
      get: (n) => elements.find(([k]) => k === n)?.[1],
      put: (k, v) => {
        elements.unshift([k, v]);
      },
    };

    expect(useKV(fake)).toBe(3);
  });

  /**
   * Exercise 4
   */
  it("asserts useKV(kv) is calling put correctly using a fake", () => {
    const elements = [] as Array<[number, number]>;

    const fake: KeyValueStore = {
      get: (n) => elements.find(([k]) => k === n)?.[1],
      put: (k, v) => {
        elements.unshift([k, v]);
      },
    };

    useKV(fake);

    expect(elements).toEqual([
      [2, 3],
      [1, 2],
      [0, 1],
    ]);
  });
});
