import * as React from "react";
import { View } from "./02-classic";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Classic View", () => {
  it("writing on input a value and clicking add leads to value being displayed", async () => {
    const { getByTestId, findByText, getByText } = render(<View />);

    const input = getByTestId("view-input");

    userEvent.type(input, "Item 1");

    const add = getByText(/add/i);

    add.click();

    await findByText(/first: item 1/i, {}, { timeout: 1600 });
  });
});
