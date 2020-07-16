/// <reference types="cypress" />

import * as React from "react";
import { mount } from "cypress-react-unit-test";
import { View } from "../src/00-context";
import * as dtl from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

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
    const input = await dtl.findByTestId(document.body, "view-input");

    userEvent.type(input, "Hello");
  });

  /**
   * Exercise 3
   */
  it("click add should add hello", async () => {
    const add = await dtl.findByText(document.body, /add/i);

    userEvent.click(add);

    await dtl.findByText(document.body, /first: hello/i, {}, { timeout: 5000 });
  });

  /**
   * Exercise 4
   */
  it("type world", async () => {
    const input = await dtl.findByTestId(document.body, "view-input");

    userEvent.type(input, "World");
  });

  /**
   * Exercise 5
   */
  it("click add should add World", async () => {
    const add = await dtl.findByText(document.body, /add/i);

    userEvent.click(add);

    await dtl.findByText(document.body, /loading/i, {}, { timeout: 5000 });
    await dtl.findByText(document.body, /world/i, {}, { timeout: 5000 });
  });
});
