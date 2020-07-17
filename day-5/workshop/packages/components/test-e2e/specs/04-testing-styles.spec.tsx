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
  it("should mount styled component", () => {
    mount(<StyledDiv data-testid={"test-elem"}>{"ok"}</StyledDiv>);
  });

  /**
   * Exercise 2
   */
  it("test-elem should not be visible", () => {
    cy.get("[data-testid='test-elem']").should("not.be.visible");
  });

  /**
   * Exercise 3
   */
  it("test-elem should be visible in macbook view", () => {
    cy.viewport("macbook-13");
    cy.get("[data-testid='test-elem']").should("be.visible");
  });
});
