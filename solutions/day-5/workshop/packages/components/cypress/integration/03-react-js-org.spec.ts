/// <reference types="cypress" />

describe("03-react-js-org", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
  });

  /**
   * Exercise 1
   */
  it("should visit https://reactjs.org/", () => {
    cy.visit("https://reactjs.org/");
  });

  /**
   * Exercise 2
   */
  it("navigate through about", () => {
    cy.get("a").contains(/docs/i).click();
    cy.wait(1000);
  });

  /**
   * Exercise 3
   */
  it("open Main Concepts", () => {
    cy.get("div")
      .contains(/Main Concepts/i)
      .click();
  });

  /**
   * Exercise 4
   */
  it("open Rendering Elements", () => {
    cy.get("a")
      .contains(/Rendering Elements/i)
      .click();
  });
});
