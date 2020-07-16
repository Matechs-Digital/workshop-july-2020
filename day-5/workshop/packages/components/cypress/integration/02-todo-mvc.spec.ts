/// <reference types="cypress" />

describe("01-go-to-google", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
  });
  /**
   * Exercise 1
   */
  it("should visit http://todomvc.com/examples/react/#/", () => {
    cy.visit("http://todomvc.com/examples/react/#/");
  });

  /**
   * Exercise 2
   */
  it("should type task-a", () => {
    cy.focused().type("task-a");
  });

  /**
   * Exercise 3
   */
  it("should press enter", () => {
    cy.focused().type("{enter}");
  });

  /**
   * Exercise 4
   */
  it("should press add a new todo task-b", () => {
    cy.get(".new-todo").type("task-b{enter}");
  });

  /**
   * Exercise 5
   */
  it("should select the Active tab", () => {
    cy.get("a").contains("Active").click();
  });

  /**
   * Exercise 6
   */
  it("should select the Completed tab", () => {
    cy.get("a").contains("Completed").click();
  });

  /**
   * Exercise 7
   */
  it("should select the All tab", () => {
    cy.get("a").contains("All").click();
  });

  /**
   * Exercise 8
   */
  it("should complete task-a", () => {
    cy.get("li").contains("task-a").parent().find(".toggle").check();
  });

  /**
   * Exercise 9
   */
  it("should select the active tab", () => {
    cy.get("a").contains("Active").click();
  });

  /**
   * Exercise 10
   */
  it("should task-a should not exist", () => {
    cy.get("li").contains("task-a").should("not.exist");
  });

  /**
   * Exercise 11
   */
  it("should task-b should be visible", () => {
    cy.get("li").contains("task-b").should("be.visible");
  });

  /**
   * Exercise 12
   */
  it("should select the Completed tab", () => {
    cy.get("a").contains("Completed").click();
  });

  /**
   * Exercise 13
   */
  it("should undo task-a", () => {
    cy.get("li").contains("task-a").parent().find(".toggle").click();
  });

  /**
   * Exercise 14
   */
  it("should select the All tab", () => {
    cy.get("a").contains("All").click();
  });

  /**
   * Exercise 15
   */
  it("should rename task-a to assignment-a", () => {
    cy.get("li")
      .contains("task-a")
      .parent()
      .dblclick()
      .parent()
      .find(".edit")
      .type("{backspace}")
      .type("{backspace}")
      .type("{backspace}")
      .type("{backspace}")
      .type("{backspace}")
      .type("{backspace}")
      .type("assignment-a{enter}");
  });
});
