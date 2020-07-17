import * as React from "react";
import { mount } from "cypress-react-unit-test";
import {
  Organizations,
  fetchOrgsContext,
  Organization,
} from "../../src/01-organizations";
import * as DTL from "@testing-library/dom";

/**
 * Using either DOM Testing Library or cy + mount
 */
describe("03-organizations", () => {
  /**
   * Exercise 1
   */
  it("should render the Organizations component", () => {
    let retry = false;

    mount(
      <fetchOrgsContext.Provider
        value={{
          fetchOrganizations: (lastId) => {
            if (retry) {
              return new Promise((r) => {
                setTimeout(() => {
                  r([
                    {
                      login: "OrgZe",
                      id: 5,
                    } as Organization,
                    {
                      login: "OrgZf",
                      id: 6,
                    } as Organization,
                  ]);
                }, 100);
              });
            }

            switch (lastId) {
              case 0: {
                return new Promise((r) => {
                  setTimeout(() => {
                    r([
                      {
                        login: "netflix",
                        id: 1,
                      } as Organization,
                      {
                        login: "google",
                        id: 2,
                      } as Organization,
                    ]);
                  }, 100);
                });
              }
              case 2: {
                return new Promise((r) => {
                  setTimeout(() => {
                    r([
                      {
                        login: "ford",
                        id: 3,
                      } as Organization,
                      {
                        login: "BMW",
                        id: 4,
                      } as Organization,
                    ]);
                  }, 100);
                });
              }
              case 4: {
                retry = true;
                return new Promise((_, r) => {
                  setTimeout(() => {
                    r();
                  }, 100);
                });
              }
              default: {
                return new Promise((r) => {
                  setTimeout(() => {
                    r([]);
                  }, 100);
                });
              }
            }
          },
        }}
      >
        <Organizations />
      </fetchOrgsContext.Provider>
    );
  });

  /**
   * Exercise 2
   */
  it("shows loading", () => {
    cy.get("#cypress-root").contains("Loading");
  });

  /**
   * Exercise 3
   */
  it("shows results when done", () => {
    cy.get("#cypress-root").contains("Organizations");
    cy.get("#cypress-root").contains("netflix, google");
  });

  /**
   * Exercise 4
   */
  it("click next", () => {
    cy.get("button").click();
  });

  /**
   * Exercise 5
   */
  it("shows loading", () => {
    cy.get("#cypress-root").contains("Loading").should("be.visible");
  });

  /**
   * Exercise 6
   */
  it("shows results when done", () => {
    cy.get("#cypress-root").contains("ford, BMW").should("be.visible");
  });

  /**
   * Exercise 7
   */
  it("click next", () => {
    cy.get("button").click();
  });

  /**
   * Exercise 8
   */
  it("shows errors when errored", () => {
    cy.get("#cypress-root").contains("unexpected error").should("be.visible");
  });

  /**
   * Exercise 9
   */
  it("clicks retry", () => {
    cy.get("button").contains("Retry").click();
  });

  /**
   * Exercise 10
   */
  it("shows loading", () => {
    cy.get("#cypress-root").contains("Loading");
  });

  /**
   * Exercise 11
   */
  it("shows results when done", () => {
    cy.get("#cypress-root").contains("Organizations");
    cy.get("#cypress-root").contains("OrgZe, OrgZf");
  });

  /**
   * Exercise 12
   */
  it("mount real github api", () => {
    mount(<Organizations />);
  });

  /**
   * Exercise 13 - (may become flacky)
   */
  it.skip("shows loading");

  /**
   * Exercise 14
   */
  it("shows results from github", () => {
    cy.get("#cypress-root").contains("Organizations");
    cy.get("#cypress-root").contains(/errfree, engineyard, ministrycentered/i);
  });
});
