import {} from "./02-testing-hooks";

describe("02-testing-hooks", () => {
  /**
   * Exercise 1:
   * with sole usage of @testing-library/react
   */
  it.todo("test useCounter increment updates the count correctly");

  /**
   * Exercise 2:
   * with sole usage of @testing-library/react
   */
  it.todo("test useAsyncCounter increment updates the count correctly");

  /**
   * Exercise 3:
   * without usage of fake timers
   */
  it.todo(
    "test useAsyncCounter increment updates the count correctly - async tracking"
  );

  /**
   * Exercise 4
   */
  it.todo("test useAsyncAutoIncrement asserting that it updates correctly");

  /**
   * Exercise 5
   */
  it.todo(
    "test useAsyncAutoIncrement asserting that by defaults updates every 5 seconds"
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
    "test useAsyncAutoIncrement using renderHook from RTL defaults at 5 seconds"
  );
});
