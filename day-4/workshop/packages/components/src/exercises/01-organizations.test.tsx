import * as React from "react";
import * as RTL from "@testing-library/react";
import * as RTH from "@testing-library/react-hooks";
import {
  useOrganisationsContext,
  Organizations,
  OrganizationsState,
  Organization,
  OrgCtx,
  useOrganisation,
  Done,
  Loading,
  Errored,
  fetchOrganizations,
} from "./01-organizations";
import * as H from "./fetchJson";

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
  it("should begin with a loading state", async () => {
    const Wrapper: React.FC = ({ children }) => (
      <OrgCtx.Provider
        value={{
          fetchOrganizations: () => Promise.resolve([]),
        }}
      >
        {children}
      </OrgCtx.Provider>
    );
    const { result, waitForNextUpdate } = RTH.renderHook(useOrganisation, {
      wrapper: Wrapper,
    });
    expect(result.current).toEqual({
      _tag: "Loading",
    });
    await waitForNextUpdate();
  });

  /**
   * Exercise 2 (5 mins)
   */
  it("should call the fetchSince function properly when mounted", async () => {
    const fetchMock = jest.fn(() => Promise.reject());
    const Wrapper: React.FC = ({ children }) => (
      <OrgCtx.Provider
        value={{
          fetchOrganizations: fetchMock,
        }}
      >
        {children}
      </OrgCtx.Provider>
    );
    const { waitForNextUpdate } = RTH.renderHook(useOrganisation, {
      wrapper: Wrapper,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await waitForNextUpdate();
  });

  /**
   * Exercise 3 (5 mins)
   */
  it("transition to a done state in case of successful exits", async () => {
    const Wrapper: React.FC = ({ children }) => (
      <OrgCtx.Provider
        value={{
          fetchOrganizations: () => Promise.resolve([]),
        }}
      >
        {children}
      </OrgCtx.Provider>
    );
    const { result, waitForNextUpdate } = RTH.renderHook(useOrganisation, {
      wrapper: Wrapper,
    });
    expect(result.current).toMatchObject<Loading>({
      _tag: "Loading",
    });
    await waitForNextUpdate();
    expect(result.current).toMatchObject<Omit<Done, "nextPage">>({
      _tag: "Done",
      orgs: [],
    });
  });

  /**
   * Exercise 4 (5 mins)
   */
  it("transition to a errored state in case of api errors", async () => {
    const Wrapper: React.FC = ({ children }) => (
      <OrgCtx.Provider
        value={{
          fetchOrganizations: () => {
            return Promise.reject("Unexpected Error");
          },
        }}
      >
        {children}
      </OrgCtx.Provider>
    );
    const { result, waitForNextUpdate } = RTH.renderHook(useOrganisation, {
      wrapper: Wrapper,
    });
    await waitForNextUpdate();
    expect(result.current).toMatchObject({
      _tag: "Errored",
      reason: "Unexpected Error",
    });
  });

  /**
   * Exercise 5 (5 mins)
   */
  it("should expose a next page function to fetch the next page in the successful scenario", async () => {
    const Wrapper: React.FC = ({ children }) => (
      <OrgCtx.Provider
        value={{
          fetchOrganizations: () => Promise.resolve([]),
        }}
      >
        {children}
      </OrgCtx.Provider>
    );
    const { result, waitForNextUpdate } = RTH.renderHook(useOrganisation, {
      wrapper: Wrapper,
    });
    await waitForNextUpdate();
    const data = result.current as Done;
    expect(data._tag).toBe("Done");
    expect(data.nextPage).toBeInstanceOf(Function);
  });

  /**
   * Exercise 6 (5 mins)
   */
  it("should expose a retry function in case of errors", async () => {
    const Wrapper: React.FC = ({ children }) => (
      <OrgCtx.Provider
        value={{
          fetchOrganizations: () => {
            return Promise.reject();
          },
        }}
      >
        {children}
      </OrgCtx.Provider>
    );
    const { result, waitForNextUpdate } = RTH.renderHook(useOrganisation, {
      wrapper: Wrapper,
    });
    await waitForNextUpdate();
    const data = result.current as Errored;
    expect(data._tag).toBe("Errored");
    expect(data.retry).toBeInstanceOf(Function);
  });

  /**
   * Exercise 7 (10 mins)
   */
  it("ensure fetching pages sequentially works fine", async () => {
    const fn = jest.fn(() =>
      Promise.resolve([{ id: 1 }, { id: 99 }] as Organization[])
    );
    const Wrapper: React.FC = ({ children }) => (
      <OrgCtx.Provider
        value={{
          fetchOrganizations: fn,
        }}
      >
        {children}
      </OrgCtx.Provider>
    );
    const { result, waitForNextUpdate } = RTH.renderHook(useOrganisation, {
      wrapper: Wrapper,
    });
    await waitForNextUpdate();
    const data = result.current as Done;
    RTH.act(() => {
      data.nextPage();
    });
    await waitForNextUpdate();
    expect(fn).toBeCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 0);
    expect(fn).toHaveBeenNthCalledWith(2, 99);
  });

  /**
   * Exercise 8 (5 mins)
   * use the coverage to discover any missing assertion in order to complete the
   * coverage for the business logic
   */
  it("ensure reload pages on error works fine", async () => {
    const fn = jest.fn(() => Promise.reject());
    const Wrapper: React.FC = ({ children }) => (
      <OrgCtx.Provider
        value={{
          fetchOrganizations: fn,
        }}
      >
        {children}
      </OrgCtx.Provider>
    );
    const { result, waitForNextUpdate } = RTH.renderHook(useOrganisation, {
      wrapper: Wrapper,
    });
    await waitForNextUpdate();
    const data = result.current as Errored;
    RTH.act(() => {
      data.retry();
    });
    await waitForNextUpdate();
    expect(fn).toBeCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 0);
    expect(fn).toHaveBeenNthCalledWith(2, 0);
  });

  it("mock fetch", async () => {
    const spy = jest.spyOn(H, "fetchJson");

    spy.mockImplementation(() => Promise.resolve([]));

    await fetchOrganizations(0);
    await fetchOrganizations(2);

    expect(spy).toHaveBeenNthCalledWith(
      1,
      "https://api.github.com/organizations?since=0"
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      "https://api.github.com/organizations?since=2"
    );
  });
});
