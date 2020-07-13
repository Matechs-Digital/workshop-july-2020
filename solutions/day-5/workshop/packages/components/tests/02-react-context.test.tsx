import * as React from "react";
import { valuesDbContext, View, UseValueDb } from "../src/02-context";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-test-renderer";

describe("02-react-context", () => {
  /**
   * Grad Exercise, cover all 02-context
   */
  it("test view in loading state", () => {
    const { getByText } = render(<View />, {
      wrapper: ({ children }) => (
        <valuesDbContext.Provider
          value={{
            useValuesDb: (): UseValueDb =>
              ({
                loading: () => true,
              } as UseValueDb),
          }}
        >
          {children}
        </valuesDbContext.Provider>
      ),
    });

    getByText(/loading/i);
  });

  it("test view when no keys are present", () => {
    const addFn = jest.fn();
    const { getByLabelText, getByTestId } = render(<View />, {
      wrapper: ({ children }) => (
        <valuesDbContext.Provider
          value={{
            useValuesDb: (): UseValueDb =>
              ({
                loading: () => false,
                size: () => 0,
                all: [],
                set: addFn,
                first: () => undefined,
              } as UseValueDb),
          }}
        >
          {children}
        </valuesDbContext.Provider>
      ),
    });

    const input = getByLabelText(/key/i);
    const submit = getByTestId("test-submit");

    act(() => {
      userEvent.type(input, "Item");
      submit.click();
    });

    expect(addFn).toHaveBeenCalledWith("Item");
  });
});
