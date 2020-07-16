import * as React from "react";
import * as RTL from "@testing-library/react";
import {
  useOrganisationsContext,
  Organizations,
  OrganizationsState,
  Organization,
} from "./01-organizations";

afterEach(RTL.cleanup);

describe("01-organizations", () => {
  /**
   *  In the first part we are going to cover the testing of the View
   */

  /**
   * Exercise 1 (5 mins)
   */
  it("should display Loading on initial state", () => {
    const Wrapper: React.FC = ({ children }) => (
      <useOrganisationsContext.Provider
        value={{
          useOrganisation() {
            return {
              _tag: "Loading",
            };
          },
        }}
      >
        {children}
      </useOrganisationsContext.Provider>
    );
    const { getByText } = RTL.render(<Organizations />, {
      wrapper: Wrapper,
    });
    getByText("Loading...");
  });

  /**
   * Exercise 2 (5 mins) - out of context
   */
  it.todo("should fetch the first page when mounted");

  /**
   * Exercise 3 (5 mins) - out of context
   */
  it.todo("should display Loading when a request is in flight");

  /**
   * Exercise 4 (5 mins)
   */
  it("should display ErrorMessage when there is an error", () => {
    const Wrapper: React.FC = ({ children }) => (
      <useOrganisationsContext.Provider
        value={{
          useOrganisation() {
            return {
              _tag: "Errored",
              reason: "Unhandled error",
              retry: () => {},
            };
          },
        }}
      >
        {children}
      </useOrganisationsContext.Provider>
    );
    const { getByText } = RTL.render(<Organizations />, { wrapper: Wrapper });
    getByText("Error: Unhandled error");
  });

  /**
   * Exercise 5 (5 mins)
   */
  it("should display the ids of the organizations when the state is done", () => {
    const fakeuseOrganisation: OrganizationsState = {
      _tag: "Done",
      orgs: [{ login: "login1" } as Organization],
      nextPage() {},
    };
    const { findAllByText } = RTL.render(
      <useOrganisationsContext.Provider
        value={{ useOrganisation: () => fakeuseOrganisation }}
      >
        <Organizations />
      </useOrganisationsContext.Provider>
    );
    findAllByText(/login1/i);
  });

  /**
   * Exercise 6 (5 mins)
   */
  it("should display the next page button only if the state is done", () => {
    const fakeuseOrganisation: OrganizationsState = {
      _tag: "Done",
      orgs: [],
      nextPage() {},
    };
    const { findAllByText } = RTL.render(
      <useOrganisationsContext.Provider
        value={{ useOrganisation: () => fakeuseOrganisation }}
      >
        <Organizations />
      </useOrganisationsContext.Provider>
    );
    findAllByText(/Next/i);
  });

  /**
   * Exercise 7 (5 mins)
   */
  it("should fetch the next page when the next page button is clicked", () => {
    const fn = jest.fn();
    const Wrapper: React.FC = ({ children }) => (
      <useOrganisationsContext.Provider
        value={{
          useOrganisation() {
            return {
              _tag: "Done",
              orgs: [
                { id: 1, login: "Sonic" },
                { id: 2, login: "hedgehoge" },
              ] as Organization[],
              nextPage: fn,
            };
          },
        }}
      >
        {children}
      </useOrganisationsContext.Provider>
    );
    const { getByText } = RTL.render(<Organizations />, {
      wrapper: Wrapper,
    });
    getByText("Sonic, hedgehoge");
    getByText("Next").click();
    expect(fn).toBeCalledTimes(1);
  });

  /**
   * Exercise 8 (5 mins)
   */
  it("should display a retry if the state is errored", () => {
    const fn = jest.fn();
    const Wrapper: React.FC = ({ children }) => (
      <useOrganisationsContext.Provider
        value={{
          useOrganisation() {
            return {
              _tag: "Errored",
              reason: "some reason",
              retry: fn,
            };
          },
        }}
      >
        {children}
      </useOrganisationsContext.Provider>
    );
    const { getByText } = RTL.render(<Organizations />, {
      wrapper: Wrapper,
    });
    getByText(/retry/i).click();
    expect(fn).toBeCalledTimes(1);
  });

  /**
   * Exercise 9
   * use the coverage to discover any missing assertion in order to complete the
   * coverage for View
   */

  /**
   *  In the second part we are going to cover the testing of the business logic
   */

  /**
   * Exercise 1 (5 mins)
   */
  it.todo("should begin with a loading state");

  /**
   * Exercise 2 (5 mins)
   */
  it.todo("should call the fetchSince function properly upon mounting");

  /**
   * Exercise 3 (5 mins)
   */
  it.todo("transition to a done state in case of successful exits");

  /**
   * Exercise 4 (5 mins)
   */
  it.todo("transition to a errored state in case of api errors");

  /**
   * Exercise 5 (5 mins)
   */
  it.todo(
    "should expose a next page to fetch the next page in the successful scenario"
  );

  /**
   * Exercise 6 (5 mins)
   */
  it.todo("should expose a retry function in case of errors");

  /**
   * Exercise 7 (5 mins)
   */
  it.todo("ensure fetching pages sequentially works fine");

  /**
   * Exercise 8 (5 mins)
   * use the coverage to discover any missing assertion in order to complete the
   * coverage for the business logic
   */
});
