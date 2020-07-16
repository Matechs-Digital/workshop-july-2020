import * as React from "react";
import * as RTL from "@testing-library/react";
import { valuesDbContext, View } from "../src/00-context";

afterEach(RTL.cleanup);

describe("00-context", () => {
  /**
   * Intro
   */
  it("display loading state", () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <valuesDbContext.Provider
          value={{
            useValuesDb: () => ({
              all: undefined as any,
              first: undefined as any,
              loading: () => true,
              set: undefined as any,
              size: undefined as any,
            }),
          }}
        >
          {children}
        </valuesDbContext.Provider>
      );
    };

    const { getByText } = RTL.render(<View />, {
      wrapper: Provider,
    });

    getByText(/loading/i);
  });

  it("add is visible in case no loading is in progress", () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <valuesDbContext.Provider
          value={{
            useValuesDb: () => ({
              all: [],
              first: undefined as any,
              loading: () => false,
              set: undefined as any,
              size: () => 0,
            }),
          }}
        >
          {children}
        </valuesDbContext.Provider>
      );
    };

    const { getByText } = RTL.render(<View />, {
      wrapper: Provider,
    });

    getByText(/add/i);
  });

  it("display first element if present", () => {
    const Provider: React.FC<{}> = ({ children }) => {
      return (
        <valuesDbContext.Provider
          value={{
            useValuesDb: () => ({
              all: [],
              first: () => "demo",
              loading: () => false,
              set: undefined as any,
              size: () => 1,
            }),
          }}
        >
          {children}
        </valuesDbContext.Provider>
      );
    };

    const { getByText } = RTL.render(<View />, {
      wrapper: Provider,
    });

    getByText(/demo/i);
  });
});
