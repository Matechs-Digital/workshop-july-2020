import * as React from "react";

import {} from "./02-context";
import { render } from "@testing-library/react";
import { View, valuesDbContext, UseValuesDb } from "./02-classic";
import userEvent from "@testing-library/user-event";

describe("02-react-context", () => {
  /**
   * Grad Exercise, cover all 02-context
   */
  it("render loading in status loading", () => {
    const useValuesDb: () => UseValuesDb = () => {
      return {
        all: undefined as any,
        first: undefined as any,
        loading: () => true,
        set: undefined as any,
        size: undefined as any,
      } as UseValuesDb;
    };

    const Provider: React.FC = ({ children }) => (
      <valuesDbContext.Provider
        value={{
          useValuesDb,
        }}
      >
        {children}
      </valuesDbContext.Provider>
    );

    const { getByText } = render(<View />, {
      wrapper: Provider,
    });

    getByText(/loading/i);
  });

  it("renders the first element if present", () => {
    const useValuesDb: () => UseValuesDb = () => {
      return {
        all: [],
        first: () => "foo",
        loading: () => false,
        set: undefined as any,
        size: () => 1,
      } as UseValuesDb;
    };

    const Provider: React.FC = ({ children }) => (
      <valuesDbContext.Provider
        value={{
          useValuesDb,
        }}
      >
        {children}
      </valuesDbContext.Provider>
    );

    const { getByText } = render(<View />, {
      wrapper: Provider,
    });

    getByText(/first: foo/i);
  });

  it("doesn't render first if empty", () => {
    const useValuesDb: () => UseValuesDb = () => {
      return {
        all: [],
        first: undefined as any,
        loading: () => false,
        set: undefined as any,
        size: () => 0,
      } as UseValuesDb;
    };

    const Provider: React.FC = ({ children }) => (
      <valuesDbContext.Provider
        value={{
          useValuesDb,
        }}
      >
        {children}
      </valuesDbContext.Provider>
    );

    const {} = render(<View />, {
      wrapper: Provider,
    });
  });

  it("render values", () => {
    const useValuesDb: () => UseValuesDb = () => {
      return {
        all: ["one", "two"],
        first: () => "one",
        loading: () => false,
        set: undefined as any,
        size: () => 2,
      } as UseValuesDb;
    };

    const Provider: React.FC = ({ children }) => (
      <valuesDbContext.Provider
        value={{
          useValuesDb,
        }}
      >
        {children}
      </valuesDbContext.Provider>
    );

    const { getByTestId } = render(<View />, {
      wrapper: Provider,
    });

    expect(getByTestId("view-item-0")).toContainHTML("one");
    expect(getByTestId("view-item-1")).toContainHTML("two");
  });

  it("click submit", () => {
    const setSpy = jest.fn();
    const useValues: () => UseValuesDb = () => {
      return {
        all: [],
        first: () => "",
        set: setSpy,
        size: () => 0,
        loading: () => false,
      };
    };
    const Provider: React.FC = ({ children }) => {
      return (
        <valuesDbContext.Provider value={{ useValuesDb: useValues }}>
          {children}
        </valuesDbContext.Provider>
      );
    };
    const { getByText, getByLabelText } = render(<View />, {
      wrapper: Provider,
    });
    const textInput = getByLabelText(/key/i);
    const submit = getByText(/add/i);
    userEvent.type(textInput, "text");
    submit.click();
    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenNthCalledWith(1, "text");
  });
});
