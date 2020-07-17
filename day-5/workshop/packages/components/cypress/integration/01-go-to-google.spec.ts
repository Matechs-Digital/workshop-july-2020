describe("01-go-to-google", () => {
  /**
   * Exercise 1
   */
  it("should visit google.com", () => {
    cy.viewport("macbook-15");
    cy.visit("https://www.google.com");
    cy.focused().type("hello{enter}");
    cy.get("h3").contains(/adele/i).should("be.a", "string");
  });
});
