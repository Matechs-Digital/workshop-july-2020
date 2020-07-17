import * as React from "react";
import { mount } from "cypress-react-unit-test";
import { View } from "../../src/00-context";
import * as DTL from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { getByText, findByText, findByTestId } from "@testing-library/dom";

/**
 * Using DOM-testing-library + mount
 */
describe("01-first-tests", () => {
  /**
   * Exercise 1
   */
  it("should render the View component", () => {
    mount(<View />);
  });

  /**
   * Exercise 2
   */
  it("type hello", async () => {
    const el = await DTL.findByTestId(document.body, "view-input");
    userEvent.type(el, "hello");
  });

  /**
   * Exercise 3
   */
  it("click add should add hello", async () => {
    const el = await DTL.findByTestId(document.body, "test-submit");
    userEvent.click(el);

    await findByText(document.body, /first: hello/i, {}, { timeout: 1500 });
  });

  /**
   * Exercise 4
   */
  it("type world", async () => {
    const el = await DTL.findByTestId(document.body, "view-input");
    userEvent.type(el, "world");
  });

  /**
   * Exercise 5
   */
  it("click add should add World", async () => {
    const el = await DTL.findByTestId(document.body, "test-submit");
    userEvent.click(el);
    await findByText(document.body, /world/i, {}, { timeout: 1500 });
  });
});
