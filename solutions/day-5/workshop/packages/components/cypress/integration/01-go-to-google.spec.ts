describe("01-go-to-google", () => {
  /**
   * Exercise 1
   */
  it("should visit google.com", () => {
    cy.viewport("macbook-13");
    cy.visit("https://www.google.com");
  });
});
