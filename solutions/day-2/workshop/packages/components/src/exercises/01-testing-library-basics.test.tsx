import * as React from "react";
import * as ReactDom from "react-dom";
import * as dom from "@testing-library/dom";
import * as rtl from "@testing-library/react";
import { Message } from "./01-Message";

afterEach(rtl.cleanup);

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
  it("assert that Message renders a div with the correct message inside", () => {
    const container = document.createElement("div");

    ReactDom.render(<Message message={"hello"} />, container);

    expect(
      container.querySelector("div [data-testid='message-box']")?.innerHTML
    ).toBe("hello");
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

    ReactDom.render(<Message message={"hello"} />, container);

    expect(dom.getByTestId(container, "message-box").innerHTML).toBe("hello");
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
    const { getByTestId } = rtl.render(<Message message={"hello"} />);

    expect(getByTestId("message-box").innerHTML).toBe("hello");
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
    const { getByTestId } = rtl.render(<Message message={"hello"} />);

    expect(getByTestId("message-box")).toContainHTML("hello");
  });
});
