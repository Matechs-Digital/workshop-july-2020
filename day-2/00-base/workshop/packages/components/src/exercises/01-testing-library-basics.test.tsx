describe("01-testing-library-basics", () => {
  /**
   * Add to your jest.config.js:
   *
   * transform: {
   *  '^.+\\.tsx?$': 'ts-jest',
   * }
   */

  /**
   * Exercise 1
   *
   * Without using any library except react, react-dom & jest
   */
  it.todo("assert that Message renders a div with the correct message inside");

  /**
   * Install @testing-library/dom in the workspace root as a devDependency
   */

  /**
   * Exercise 2
   *
   * Rewrite exercise 1 using @testing-library/dom to query the div containing the message
   */
  it.todo(
    "assert that Message renders a div with the correct message inside (dom-testing-library)"
  );

  /**
   * Install @testing-library/react in the workspace root as a devDependency
   */

  /**
   * Exercise 3
   *
   * Rewrite exercise 2 using @testing-library/react to render the react component
   */
  it.todo(
    "assert that Message renders a div with the correct message inside (react-testing-library)"
  );

  /**
   * Install @testing-library/jest-dom, add to jest.config.js:
   *
   * setupFilesAfterEnv: ["./jest.setup.ts"]
   */

  /**
   * Create jest.setup.ts with:
   * import "@testing-library/jest-dom";
   */

  /**
   * Exercise 4
   *
   * Rewrite exercise 3 using @testing-library/jest-dom perform the assertion
   */
  it.todo(
    "assert that Message renders a div with the correct message inside (jest-dom-testing-library)"
  );

  /**
   * Exercise 5
   */
  it.todo(
    "assert that clicking on the + button of the Counter component leads to an increment"
  );

  /**
   * Exercise 6:
   * use getByTestId
   */
  it.todo(
    "assert that clicking on the + button of the Counter component leads to an increment - 2"
  );

  /**
   * Exercise 7:
   * without the usage of findBy*
   */
  it.todo(
    "assert that clicking on the + button of the AsyncCounter component leads to an increment"
  );

  /**
   * Exercise 8:
   * using findBy* to wait
   */
  it.todo(
    "assert that clicking on the + button of the AsyncCounter component leads to an increment - 2"
  );

  /**
   * Exercise 9:
   * using fake timers to bring down test time to < 100ms
   */
  it.todo(
    "assert that clicking on the + button of the AsyncCounter component leads to an increment - 3"
  );

  /**
   * Exercise 10
   */
  it.todo("assert that AutoIncrement increments after 5 seconds");

  /**
   * Exercise 11
   */
  it.todo(
    "assert that AutoIncrement increments each 5 seconds for a minimum of 3 times"
  );

  /**
   * Exercise 12
   */
  it.todo("assert that AutoIncrementAsync increments each 5 seconds");

  /**
   * Exercise 13:
   * set interval via prop
   */
  it.todo(
    "assert that AutoIncrementAsync increments each 5 seconds in < 2000ms"
  );

  /**
   * Exercise 14:
   * use spies to control delay
   */
  it.todo(
    "assert that AutoIncrementAsync increments each 5 seconds in < 200ms"
  );

  /**
   * Exercise 15:
   * use fake timers to control flow
   */
  it.todo("assert that AutoIncrementAsync increments each 5 seconds in < 50ms");
});
