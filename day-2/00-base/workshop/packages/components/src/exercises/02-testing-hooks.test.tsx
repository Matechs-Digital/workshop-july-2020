import {} from "./02-testing-hooks";

describe("02-testing-hooks", () => {
  /**
   * Exercise 1:
   * with sole usage of @testing-library/react
   */
  it.todo("assert that useCounter increments the count correctly");

  /**
   * Exercise 2:
   * with sole usage of @testing-library/react
   */
  it.todo("asserts that useAsyncCounter increments the count correctly");

  /**
   * Exercise 3:
   * without usage of fake timers
   */
  it.todo(
    "asserts that useAsyncCounter increments the count correctly - async tracking"
  );

  /**
   * Exercise 4
   */
  it.todo("asserts that useAsyncAutoIncrement updates itself correctly");

  /**
   * Exercise 5
   */
  it.todo(
    "asserts that useAsyncAutoIncrement by defaults updates itself every 5 seconds"
  );

  /**
   * Install @testing-library/react-hooks & react-test-renderer into the workspace root as devDependency
   */

  /**
   * Exercise 6
   */
  it.todo("test useAsyncAutoIncrement using renderHook from RTL");

  /**
   * Exercise 7:
   * Try to use fakeTimers with RTL
   */
  it.todo(
    "test useAsyncAutoIncrement using renderHook from RTL with defaults at 5 seconds"
  );
});
