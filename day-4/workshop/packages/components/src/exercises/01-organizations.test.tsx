import * as RTL from "@testing-library/react";
import * as RTH from "@testing-library/react-hooks";
import * as React from "react";
import {
  organizationContext,
  Organizations,
  useOrganizations,
  fetchOrganizations,
  fetchOrgsContext,
  Done,
  Errored,
} from "./01-organizations-context";
import * as H from "./01-http";

afterEach(RTL.cleanup);
afterEach(() => {
  jest.restoreAllMocks();
});
describe("01-organizations", () => {
  /**
   *  In the first part we are going to cover the testing of the View
   */

  /**
   * Exercise 1 (5 mins)
   */
  it("should display Loading on initial state", () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <organizationContext.Provider
          value={{
            useOrganizations: () => ({
              _tag: "Loading",
            }),
          }}
        >
          {children}
        </organizationContext.Provider>
      );
    };
    const { getByText } = RTL.render(<Organizations />, {
      wrapper: Provider,
    });
    getByText(/Loading.../i);
  });

  /**
   * Exercise 2 (5 mins) - out of purpose
   */
  it.todo("should fetch the first page when mounted");

  /**
   * Exercise 3 (5 mins) - out of purpose
   */
  it.todo("should display Loading when a request is in flight");

  /**
   * Exercise 4 (5 mins)
   */
  it("should display ErrorMessage when there is an error", () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <organizationContext.Provider
          value={{
            useOrganizations: () => ({
              _tag: "Errored",
              error: "baad",
              retryPage: undefined as any,
            }),
          }}
        >
          {children}
        </organizationContext.Provider>
      );
    };
    const { getByText } = RTL.render(<Organizations />, {
      wrapper: Provider,
    });
    getByText(/baad/i);
  });

  /**
   * Exercise 5 (5 mins)
   */
  it("should display the ids of the organizations when the state is done", () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <organizationContext.Provider
          value={{
            useOrganizations: () => ({
              _tag: "Done",
              organizations: [
                {
                  login: "loginA",
                  id: 1,
                  node_id: undefined as any,
                  url: undefined as any,
                  repos_url: undefined as any,
                  events_url: undefined as any,
                  hooks_urs: undefined as any,
                  issues_url: undefined as any,
                  members_url: undefined as any,
                  public_members_url: undefined as any,
                },
              ],
              fetchNext: undefined as any,
            }),
          }}
        >
          {children}
        </organizationContext.Provider>
      );
    };
    const { getByText } = RTL.render(<Organizations />, {
      wrapper: Provider,
    });
    getByText(/loginA/i);
  });

  /**
   * Exercise 6 (5 mins) - slightly overtest
   */
  it.todo("should display the next page button only if the state is done");

  /**
   * Exercise 7 (5 mins)
   */
  it("should fetch the next page when the next page button is clicked", () => {
    const f = jest.fn();
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <organizationContext.Provider
          value={{
            useOrganizations: () => ({
              _tag: "Done",
              organizations: [],
              fetchNext: f,
            }),
          }}
        >
          {children}
        </organizationContext.Provider>
      );
    };
    const { getByText } = RTL.render(<Organizations />, {
      wrapper: Provider,
    });
    getByText(/Next/i).click();
    expect(f).toBeCalledTimes(1);
  });

  /**
   * Exercise 8 (5 mins)
   */
  it("should display a retry only if the state is errored", () => {
    const f = jest.fn();
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <organizationContext.Provider
          value={{
            useOrganizations: () => ({
              _tag: "Errored",
              error: "unexpected error",
              retryPage: f,
            }),
          }}
        >
          {children}
        </organizationContext.Provider>
      );
    };
    const { getByText } = RTL.render(<Organizations />, {
      wrapper: Provider,
    });
    getByText(/Retry/i).click();
    expect(f).toHaveBeenCalledTimes(1);
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
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <fetchOrgsContext.Provider
          value={{
            fetchOrganizations: () => Promise.reject(),
          }}
        >
          {children}
        </fetchOrgsContext.Provider>
      );
    };
    const { result, waitForNextUpdate } = RTH.renderHook(
      () => useOrganizations(),
      {
        wrapper: Provider,
      }
    );

    expect(result.current._tag).toBe("Loading");

    await waitForNextUpdate();
  });

  /**
   * Exercise 2 (5 mins)
   */
  it("should call the fetchOrganizations function properly when mounting", async () => {
    const f = jest.fn();
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <fetchOrgsContext.Provider
          value={{
            fetchOrganizations: () => {
              f();
              return Promise.resolve([]);
            },
          }}
        >
          {children}
        </fetchOrgsContext.Provider>
      );
    };
    const { waitForNextUpdate } = RTH.renderHook(() => useOrganizations(), {
      wrapper: Provider,
    });
    expect(f).toHaveBeenCalledTimes(1);
    await waitForNextUpdate();
  });

  /**
   * Exercise 3 (5 mins)
   */
  it("transition to a done state in case of successful exits", async () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <fetchOrgsContext.Provider
          value={{
            fetchOrganizations: () => Promise.resolve([]),
          }}
        >
          {children}
        </fetchOrgsContext.Provider>
      );
    };
    const { result, waitForNextUpdate } = RTH.renderHook(
      () => useOrganizations(),
      {
        wrapper: Provider,
      }
    );
    await waitForNextUpdate();
    expect(result.current._tag).toEqual("Done");
  });

  /**
   * Exercise 4 (5 mins)
   */
  it("transition to a errored state in case of api errors", async () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <fetchOrgsContext.Provider
          value={{
            fetchOrganizations: () => Promise.reject(),
          }}
        >
          {children}
        </fetchOrgsContext.Provider>
      );
    };
    const { result, waitForNextUpdate, unmount } = RTH.renderHook(
      () => useOrganizations(),
      {
        wrapper: Provider,
      }
    );
    await waitForNextUpdate();
    expect(result.current._tag).toEqual("Errored");
  });

  /**
   * Exercise 5 (5 mins)
   */
  it("should expose a next page to fetch the next page in the successful scenario", async () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <fetchOrgsContext.Provider
          value={{
            fetchOrganizations: () => {
              return Promise.resolve([]);
            },
          }}
        >
          {children}
        </fetchOrgsContext.Provider>
      );
    };
    const { result, waitForNextUpdate } = RTH.renderHook(
      () => useOrganizations(),
      {
        wrapper: Provider,
      }
    );
    await waitForNextUpdate();
    expect(typeof (result.current as Done).fetchNext).toBe("function");
  });

  /**
   * Exercise 6 (5 mins)
   */
  it("should expose a retry function in case of errors", async () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <fetchOrgsContext.Provider
          value={{
            fetchOrganizations: () => Promise.reject(),
          }}
        >
          {children}
        </fetchOrgsContext.Provider>
      );
    };
    const { result, waitForNextUpdate } = RTH.renderHook(
      () => useOrganizations(),
      { wrapper: Provider }
    );
    await waitForNextUpdate();
    expect(typeof (result.current as Errored).retryPage).toBe("function");
  });

  /**
   * Exercise 7 (5 mins)
   */
  it("ensure fetching pages sequentially works fine", async () => {
    const f = jest.fn();
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <fetchOrgsContext.Provider
          value={{
            fetchOrganizations: (n) => {
              f(n);
              switch (n) {
                case 0:
                  return new Promise((r) => {
                    r([
                      {
                        login: "loginA",
                        id: 1,
                        node_id: undefined as any,
                        url: undefined as any,
                        repos_url: undefined as any,
                        events_url: undefined as any,
                        hooks_urs: undefined as any,
                        issues_url: undefined as any,
                        members_url: undefined as any,
                        public_members_url: undefined as any,
                      },
                    ]);
                  });
                case 1:
                  return Promise.resolve([
                    {
                      login: "loginB",
                      id: 2,
                      node_id: undefined as any,
                      url: undefined as any,
                      repos_url: undefined as any,
                      events_url: undefined as any,
                      hooks_urs: undefined as any,
                      issues_url: undefined as any,
                      members_url: undefined as any,
                      public_members_url: undefined as any,
                    },
                  ]);
                case 2:
                  return Promise.resolve([
                    {
                      login: "loginC",
                      id: 3,
                      node_id: undefined as any,
                      url: undefined as any,
                      repos_url: undefined as any,
                      events_url: undefined as any,
                      hooks_urs: undefined as any,
                      issues_url: undefined as any,
                      members_url: undefined as any,
                      public_members_url: undefined as any,
                    },
                  ]);
                default: {
                  return Promise.resolve([]);
                }
              }
            },
          }}
        >
          {children}
        </fetchOrgsContext.Provider>
      );
    };
    const { result, waitForNextUpdate } = RTH.renderHook(
      () => useOrganizations(),
      {
        wrapper: Provider,
      }
    );

    await waitForNextUpdate();

    expect(result.current._tag).toBe("Done");

    RTH.act(() => {
      (result.current as Done).fetchNext();
    });

    expect(result.current._tag).toBe("Loading");

    await waitForNextUpdate();

    expect(result.current._tag).toBe("Done");

    RTH.act(() => {
      (result.current as Done).fetchNext();
    });

    expect(result.current._tag).toBe("Loading");

    await waitForNextUpdate();

    expect(result.current._tag).toBe("Done");

    expect(f).toHaveBeenCalledTimes(3);
    expect(f).toHaveBeenNthCalledWith(1, 0);
    expect(f).toHaveBeenNthCalledWith(2, 1);
    expect(f).toHaveBeenNthCalledWith(3, 2);
  });

  /**
   * Exercise 8 (5 mins)
   * use the coverage to discover any missing assertion in order to complete the
   * coverage for the business logic
   */
  it("ensure retry works fine", async () => {
    const f = jest.fn();
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <fetchOrgsContext.Provider
          value={{
            fetchOrganizations: (id) => {
              f(id);
              switch (id) {
                case 0:
                  return Promise.resolve([
                    {
                      login: "OrgZ1",
                      id: 1,
                      node_id: "1",
                      url: undefined as any,
                      repos_url: undefined as any,
                      events_url: undefined as any,
                      hooks_urs: undefined as any,
                      issues_url: undefined as any,
                      members_url: undefined as any,
                      public_members_url: undefined as any,
                    },
                  ]);
                case 1:
                  return Promise.reject();
                default:
                  return Promise.resolve([]);
              }
            },
          }}
        >
          {children}
        </fetchOrgsContext.Provider>
      );
    };
    const { result, waitForNextUpdate } = RTH.renderHook(
      () => useOrganizations(),
      {
        wrapper: Provider,
      }
    );
    await waitForNextUpdate();
    expect(result.current._tag).toBe("Done");
    RTH.act(() => {
      (result.current as Done).fetchNext();
    });
    expect(result.current._tag).toBe("Loading");
    await waitForNextUpdate();
    expect(result.current._tag).toBe("Errored");
    RTH.act(() => {
      (result.current as Errored).retryPage();
    });
    await waitForNextUpdate();
    expect(f).toHaveBeenCalledTimes(3);
    expect(f).toHaveBeenNthCalledWith(1, 0);
    expect(f).toHaveBeenNthCalledWith(2, 1);
    expect(f).toHaveBeenNthCalledWith(3, 1);
  });

  it("fetchOrganizations", async () => {
    const spy = jest.spyOn(H, "fetchJson");

    spy.mockImplementation(() => {
      return Promise.resolve([]);
    });

    await fetchOrganizations(0);

    expect(spy).toHaveBeenNthCalledWith(
      1,
      "https://api.github.com/organizations?since=0"
    );

    await fetchOrganizations(1);

    expect(spy).toHaveBeenNthCalledWith(
      2,
      "https://api.github.com/organizations?since=1"
    );
  });
});
