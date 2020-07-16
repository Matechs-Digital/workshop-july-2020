/// <reference types="cypress" />

import * as React from "react";
import { mount } from "cypress-react-unit-test";
import {
  Organizations,
  fetchOrgsContext,
  Organization,
} from "../../src/01-organizations";
import * as DTL from "@testing-library/dom";

/**
 * Using DOM-testing-library + mount
 */
describe("03-organizations", () => {
  /**
   * Exercise 1
   */
  it("should render the Organizations component", async () => {
    let retryCount = 0;
    mount(
      <fetchOrgsContext.Provider
        value={{
          fetchOrganizations: (n) => {
            switch (n) {
              case 0: {
                return new Promise((r) => {
                  setTimeout(() => {
                    r([
                      {
                        id: 1,
                        login: "login-1",
                      } as Organization,
                    ]);
                  }, 1000);
                });
              }
              case 1: {
                return new Promise((r) => {
                  setTimeout(() => {
                    r([
                      {
                        id: 2,
                        login: "login-2",
                      } as Organization,
                    ]);
                  }, 1000);
                });
              }
              case 2: {
                return new Promise((res, rej) => {
                  retryCount += 1;

                  if (retryCount > 1) {
                    setTimeout(() => {
                      res([
                        {
                          id: 3,
                          login: "login-3",
                        } as Organization,
                      ]);
                    }, 1000);
                  } else {
                    setTimeout(() => {
                      rej();
                    }, 1000);
                  }
                });
              }
              default: {
                return Promise.resolve([]);
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
   * Exercise 1
   */
  it("shows loading", async () => {
    await DTL.findByText(document.body, /loading/i);
  });

  /**
   * Exercise 2
   */
  it("shows results when done", async () => {
    await DTL.findByText(document.body, /login-1/i);
  });

  /**
   * Exercise 3
   */
  it("click next", async () => {
    (await DTL.findByText(document.body, /next/i)).click();
  });

  /**
   * Exercise 4
   */
  it("shows loading", async () => {
    await DTL.findByText(document.body, /loading/i);
  });

  /**
   * Exercise 5
   */
  it("shows results when done", async () => {
    await DTL.findByText(document.body, /login-2/i);
  });

  /**
   * Exercise 6
   */
  it("click next", async () => {
    (await DTL.findByText(document.body, /next/i)).click();
  });

  /**
   * Exercise 7
   */
  it("shows errors when errored", async () => {
    await DTL.findByText(document.body, /unexpected/i);
  });

  /**
   * Exercise 8
   */
  it("clicks retry", async () => {
    (await DTL.findByText(document.body, /retry/i)).click();
  });

  /**
   * Exercise 9
   */
  it("shows loading", async () => {
    await DTL.findByText(document.body, /loading/i);
  });

  /**
   * Exercise 10
   */
  it("shows results when done", async () => {
    await DTL.findByText(document.body, /login-3/i);
  });

  /**
   * Exercise 11
   */
  it("mount real github api", () => {
    mount(<Organizations />);
  });

  /**
   * Exercise 12 - (may become flacky)
   */
  it.skip("shows loading", async () => {
    await DTL.findByText(document.body, /loading/i);
  });

  /**
   * Exercise 13
   */
  it("shows results from github", async () => {
    await DTL.findByText(
      document.body,
      /errfree, engineyard, ministrycentered/i
    );
    await DTL.findByText(document.body, /Next/i);
  });
});
