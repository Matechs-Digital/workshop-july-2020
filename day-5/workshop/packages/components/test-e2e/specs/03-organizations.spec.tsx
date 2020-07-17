import * as React from "react";
import { mount } from "cypress-react-unit-test";
import {
  Organizations,
  fetchOrgsContext,
  Organization,
} from "../../src/01-organizations";

/**
 * Using anything you've seen so far + mount
 */
describe("03-organizations", () => {
  /**
   * Exercise 0
   */
  it("should render the Organizations component", () => {
    const orgs = [
      { id: 1, login: "test1" },
      { id: 2, login: "test2" },
      { id: 3, login: "test3" },
      { id: 4, login: "test4" },
      { id: 5, login: "test5" },
      { id: 6, login: "test6" },
    ] as Organization[];

    let hasErrored = false;

    mount(
      <fetchOrgsContext.Provider
        value={{
          fetchOrganizations: (lastId) =>
            new Promise((resolve, reject) => {
              let res: Organization[] = [];
              switch (lastId) {
                case 0:
                  res = orgs.slice(0, 2);
                  break;
                case 2:
                  res = orgs.slice(2, 4);
                  break;
                case 4:
                  if (!hasErrored) {
                    hasErrored = true;
                    reject();
                  } else {
                    res = orgs.slice(4, 6);
                  }
                  break;
                default:
                  reject();
              }
              setTimeout(() => {
                resolve(res);
              }, 500);
            }),
        }}
      >
        <Organizations />
      </fetchOrgsContext.Provider>
    );
  });

  /**
   * Exercise 1
   */
  it("shows loading", () => {
    cy.get("body").contains(/loading/i);
  });

  /**
   * Exercise 2
   */
  it("shows results when done", () => {
    cy.get("#cypress-root").contains(/test1/i).should("be.visible");
  });

  /**
   * Exercise 3
   */
  it("click next", () => {
    cy.get("button").click();
  });

  /**
   * Exercise 4
   */
  it("shows loading", () => {
    cy.get("body").contains(/loading/i);
  });

  /**
   * Exercise 5
   */
  it("shows results when done", () => {
    cy.get("#cypress-root").contains(/test3/i).should("be.visible");
  });

  /**
   * Exercise 6
   */
  it("click next", () => {
    cy.get("button").click();
  });

  /**
   * Exercise 7
   */
  it("shows errors when errored", () => {
    cy.get("#cypress-root").contains("unexpected error");
  });

  /**
   * Exercise 8
   */
  it("clicks retry", () => {
    cy.get("button").click();
  });

  /**
   * Exercise 9
   */
  it("shows loading", () => {
    cy.get("body").contains(/loading/i);
  });

  /**
   * Exercise 10
   */
  it("shows results when done", () => {
    cy.get("#cypress-root").contains(/test5/i).should("be.visible");
  });

  /**
   * Exercise 11
   */
  it("mount real github api", () => {
    mount(<Organizations />);
  });

  /**
   * Exercise 13
   */
  it("shows results from github", () => {
    cy.get("div").contains("railslove");
  });
});
