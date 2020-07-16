/// <reference types="cypress" />

import * as React from "react";
import { mount } from "cypress-react-unit-test";
import styled from "styled-components";

const StyledDiv = styled.div`
  @media (max-width: 500px) {
    display: none;
  }
`;

describe("04-testing-styles", () => {
  /**
   * Exercise 1
   */
  it("should mount styled component");

  /**
   * Exercise 2
   */
  it("test-elem should not be visible");

  /**
   * Exercise 3
   */
  it("test-elem should be visible in macbook view");
});
