import * as React from "react";
import * as ReactDOM from "react-dom";
import * as DTL from "@testing-library/dom";
import * as RTL from "@testing-library/react";
import { Message, Counter, AsyncCounter } from "./01-testing-library-basics";
import { act } from "react-dom/test-utils";

afterEach(() => {
  jest.useRealTimers();
});

describe("01-testing-library-basics", () => {
  /**
   * Exercise 1
   *
   * Without using any library except react, react-dom & jest
   */
  it("assert that Message renders a div with the correct message inside", () => {
    const container = document.createElement("div");
    ReactDOM.render(<Message message={"message"} />, container);
    expect(
      container.querySelector("div [data-testid='message-box']")?.innerHTML
    ).toBe("message");
  });

  /**
   * Install @testing-library/dom in the workspace root as a devDependency
   */

  /**
   * Exercise 2
   *
   * Rewrite exercise 1 using @testing-library/dom to query the div containing the message
   */
  it("assert that Message renders a div with the correct message inside (dom-testing-library)", () => {
    const container = document.createElement("div");
    ReactDOM.render(<Message message={"message"} />, container);

    DTL.getByText(container, /message/i);
  });

  /**
   * Install @testing-library/react in the workspace root as a devDependency
   */

  /**
   * Exercise 3
   *
   * Rewrite exercise 2 using @testing-library/react to render the react component
   */
  it("assert that Message renders a div with the correct message inside (react-testing-library)", () => {
    const { getByText, unmount } = RTL.render(<Message message={"message"} />);

    getByText(/message/i);

    unmount();
  });

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
  it("assert that Message renders a div with the correct message inside (jest-dom-testing-library)", () => {
    const { getByTestId, unmount } = RTL.render(
      <Message message={"message"} />
    );

    const mbox = getByTestId("message-box");

    expect(mbox).toContainHTML("message");

    unmount();
  });

  /**
   * Exercise 5
   */
  it("assert that clicking on the + button of the Counter component leads to an increment", () => {
    const { getByText } = RTL.render(<Counter />);

    getByText("0");
    getByText("+").click();
    getByText("1");
    getByText("+").click();
    getByText("2");
  });

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
  it("assert that clicking on the + button of the AsyncCounter component leads to an increment", () => {
    const { getByText } = RTL.render(<AsyncCounter />);

    jest.useFakeTimers();
    getByText("0");
    getByText("+").click();
    act(() => {
      jest.advanceTimersByTime(1610);
    });
    getByText("1");
  });

  /**
   * Exercise 8:
   * using findBy* to wait
   */
  it("assert that clicking on the + button of the AsyncCounter component leads to an increment - 2", async () => {
    const { getByText, findByText } = RTL.render(<AsyncCounter />);

    getByText("0");
    getByText("+").click();
    await findByText("1", {}, { timeout: 1600 });
  });

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
