/// <reference types="cypress" />

import * as React from "react";
import { mount } from "cypress-react-unit-test";
import { View } from "@workshop/components/previous/02-context";
import * as dtl from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

describe("01-first-test", () => {
  /**
   * Exercise 1
   */
  it("should render the View component", async () => {
    mount(<View />);

    const input = await dtl.findByTestId(document.body, "view-input");
    const add = await dtl.findByText(document.body, /add/i);

    userEvent.type(input, "Hello");
    userEvent.click(add);

    await dtl.findByText(document.body, /first: hello/i, {}, { timeout: 5000 });
  });
});
