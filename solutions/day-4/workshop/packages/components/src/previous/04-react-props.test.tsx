import * as React from "react";
import { View, UseValueDb } from "./04-props";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-test-renderer";

describe("02-react-context", () => {
  /**
   * Grad Exercise, cover all 04-props
   */
  it("test view in loading state", () => {
    const { getByText } = render(
      <View
        runtime={{
          valueDb: {
            useValuesDb: (): UseValueDb =>
              ({
                loading: () => true,
              } as UseValueDb),
          },
        }}
      />
    );

    getByText(/loading/i);
  });

  it("test view when no keys are present", () => {
    const addFn = jest.fn();
    const { getByLabelText, getByTestId } = render(
      <View
        runtime={{
          valueDb: {
            useValuesDb: (): UseValueDb =>
              ({
                loading: () => false,
                size: () => 0,
                all: [],
                set: addFn,
                first: () => undefined,
              } as UseValueDb),
          },
        }}
      />
    );

    const input = getByLabelText(/key/i);
    const submit = getByTestId("test-submit");

    act(() => {
      userEvent.type(input, "Item");
      submit.click();
    });

    expect(addFn).toHaveBeenCalledWith("Item");
  });
});
