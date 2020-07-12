/// <reference types="cypress" />

import * as React from "react";
import { mount } from "cypress-react-unit-test";
import { View } from "@workshop/components/previous/02-context";

describe("01-first-test", () => {
  /**
   * Exercise 1
   */
  it("should render the View component", () => {
    mount(<View />);
  });
});
