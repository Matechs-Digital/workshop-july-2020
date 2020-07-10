import {} from "./02-mocking";

describe("02-mocking", () => {
  /**
   * A stub is an object that resembles a real object with the minimum number of methods needed for a test.
   * A stub is referred to as the lightest, and the most static version of the test doubles.
   */

  /**
   * Exercise 1
   */
  it.todo("asserts useKV(kv) returns kv.get(2) using a stub");

  /**
   * Spies are known as partially mock objects. It means spy creates a partial object or a half dummy
   * of the real object by stubbing or spying the real ones. In spying, the real object remains unchanged,
   * and we just spy some specific methods of it. In other words, we take the existing (real) object
   * and replace or spy only some of its methods.
   */

  /**
   * Exercise 2
   */
  it.todo("asserts useKV(kv) returns kv.get(2) using a spy");

  /**
   * Fakes are fully functional replacements of the objects
   */

  /**
   * Exercise 3
   */
  it.todo("asserts useKV(kv) returns kv.get(2) using a fake");

  /**
   * Exercise 4
   */
  it.todo("asserts useKV(kv) is calling put correctly using a fake");

  /**
   * Exercise 5
   */
  it.todo(
    "asserts using useMainKV() is calling put correctly using a jest spy"
  );
});
