describe("02-todo-mvc", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
  });

  /**
   * Exercise 1
   */
  it("should visit", () => {
    cy.visit("http://todomvc.com/examples/react/#/");
  });

  /**
   * Exercise 2
   */
  it("should type task-a", () => {
    cy.get("input").type("task-a");
  });

  /**
   * Exercise 3
   */
  it("should press enter", () => {
    cy.get("input").type("{enter}");
  });

  /**
   * Exercise 4
   */
  it("should add a new todo task-b", () => {
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
    cy.get("body")
      .contains(/task-a/)
      .should("not.exist");
  });

  /**
   * Exercise 11
   */
  it("should task-b should be visible", () => {
    cy.get("body")
      .contains(/task-b/)
      .should("be.visible");
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
    cy.get("li").contains("task-a").parent().find(".toggle").uncheck();
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
      .dblclick()
      .focused()
      .clear()
      .type("assignment-a{enter}");
  });

  /**
   * Exercise 16
   */
  it("should check toggle all", () => {
    cy.get("#toggle-all").click({ force: true });
  });

  /**
   * Exercise 17
   */
  it("clear all completed", () => {
    cy.get("button")
      .contains(/clear completed/i)
      .click();
  });
});
