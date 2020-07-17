import { mount } from "cypress-react-unit-test";
import { View } from "../../src/00-context";
import * as React from "react";

// import * as React from "react";
// import { mount } from "cypress-react-unit-test";
// import { View } from "../src/00-context";

/**
 * Using cy + mount
 */
describe("first-tests-with-cy", () => {
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
    cy.get("#key").type("hello");
  });

  /**
   * Exercise 3
   */
  it("click add should add hello", () => {
    cy.get("[data-testid='test-submit']").click();
  });

  /**
   * Exercise 4
   */
  it("type world", () => {
    cy.get("#key").type("world");
  });

  /**
   * Exercise 5
   */
  it("click add should add World", () => {
    cy.get("[data-testid='test-submit']").click();
  });

  /**
   * Exercise 6
   */
  it("assert that hello & world are visible", () => {
    cy.get("[data-testid='view-item-0']").should("be.visible");
    cy.get("[data-testid='view-item-0']").should("contain.text", "hello");
    cy.get("[data-testid='view-item-1']").should("be.visible");
    cy.get("[data-testid='view-item-1']").should("contain.text", "world");
  });
});
