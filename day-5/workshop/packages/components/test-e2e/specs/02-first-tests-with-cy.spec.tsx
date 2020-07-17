import * as React from "react";
import { mount } from "cypress-react-unit-test";
import { View } from "../../src/00-context";

/**
 * Using cy + mount
 */
describe("first-tests-with-cy", () => {
  /**
   * Exercise 1
   */
  it("should render the View component", () => {
    mount(<View />);
    cy.get("[data-testid='view-input']").should("be.visible");
  });

  /**
   * Exercise 2
   */
  it("type hello", () => {
    cy.get("[data-testid='view-input']").type("hello");
  });

  /**
   * Exercise 3
   */
  it("click add should add hello", () => {
    cy.get("[data-testid='test-submit']").click();
    cy.get("[data-testid='view-first']").contains(/hello/i);
  });

  /**
   * Exercise 4
   */
  it("type world", () => {
    cy.get("input").type("world");
  });

  /**
   * Exercise 5
   */
  it("click add should add World", () => {
    cy.get("button").click();
    cy.get("[data-testid=view-item-1]").contains(/world/i);
  });

  /**
   * Exercise 6
   */
  it("assert that hello & world are visible", () => {
    cy.get("[data-testid=view-item-0]").contains(/hello/i).should("be.visible");
    cy.get("[data-testid=view-item-1]").contains(/world/i).should("be.visible");
  });
});
