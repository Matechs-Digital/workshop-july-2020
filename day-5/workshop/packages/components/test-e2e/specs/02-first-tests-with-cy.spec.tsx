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
    cy.get("button").contains("Add").click();
    cy.get("[data-testid=view-item-0]").contains("hello").should("be.visible");
  });

  /**
   * Exercise 4
   */
  it("type world", () => {
    cy.get("[data-testid='view-input']").type("world");
  });

  /**
   * Exercise 5
   */
  it("click add should add World", () => {
    cy.get("button").contains("Add").click();
  });

  /**
   * Exercise 6
   */
  it("assert that hello & world are visible", () => {
    cy.get("[data-testid=view-item-0]").contains("hello").should("be.visible");
    cy.get("[data-testid=view-item-1]").contains("world").should("be.visible");
  });

  it("should not add duplicates", () => {
    cy.get("[data-testid='view-input']").type("world");
    cy.get("button").contains("Add").click();
    cy.get("#cypress-root").contains(/loading/i);
    cy.get("#cypress-root")
      .contains(/loading/i)
      .should("not.be.visible");
    cy.get("[data-testid=view-item-2]").should("not.be.visible");
  });

  it("click add not add new divs", () => {
    cy.get("button").contains("Add").click();
    cy.get("body").find("[data-testid^=view-item]").should("have.length", 2);
  });
});
