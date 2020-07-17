import * as React from "react";
import { mount } from "cypress-react-unit-test";
import { View } from "../../src/00-context";
import * as DTL from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

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
  it("type hello", () => {
    const input = DTL.getByTestId(document.body, "view-input");
    userEvent.type(input, "hello");
  });

  /**
   * Exercise 3
   */
  it("click add hello & appear", async () => {
    const addButton = await DTL.findByTestId(document.body, "test-submit");
    userEvent.click(addButton);
    await DTL.findByText(document.body, /first: hello/i, {}, { timeout: 5000 });
  });

  /**
   * Exercise 4
   */
  it("type world", () => {
    const input = DTL.getByTestId(document.body, "view-input");
    userEvent.type(input, "world");
  });

  /**
   * Exercise 5
   */
  it("click add should add World", async () => {
    const btn = DTL.getByTestId(document.body, "test-submit");
    userEvent.click(btn);
    await DTL.findByTestId(
      document.body,
      "view-item-1",
      {},
      {
        timeout: 2000,
      }
    );
  });

  it("type world again", async () => {
    const input = await DTL.findByTestId(document.body, "view-input");
    userEvent.type(input, "world");
  });

  it("click add should not add World", async () => {
    const button = await DTL.findByTestId(document.body, "test-submit");
    userEvent.click(button);
    const elements = await DTL.findAllByText(
      document.body,
      /world/i,
      {},
      { timeout: 2000 }
    );
    expect(elements.length).to.eq(1);
  });

  it("type empty value", async () => {
    const input = await DTL.findByTestId(document.body, "view-input");
    userEvent.type(input, "");
  });

  it("click add should not add empty value", async () => {
    const button = await DTL.findByTestId(document.body, "test-submit");
    userEvent.click(button);
    await DTL.findByTestId(document.body, "view-item-1", {}, { timeout: 2000 });
    const newElement = DTL.queryByTestId(document.body, "view-item-2");
    expect(newElement).to.eq(null);
  });
});
