import * as React from "react";
import * as RTL from "@testing-library/react";
import { RemConverter } from "./04-generative-react";

/**
 * Note,
 * if we are in a case where we always want to clean up after each test the rendered components
 * we can use the cleanup function provided by rtl, this doesn't give granular control as defer
 * but can be used as a default for most of the scenarios
 */
afterEach(RTL.cleanup);

describe("04-classic", () => {
  /**
   * Exercise 1 (2 mins)
   */
  it("should render correctly", () => {
    expect(RTL.render(<RemConverter />)).toBeDefined();
  });

  /**
   * Exercise 1 (5 mins)
   */
  it("should convert px to the right rem value", async () => {
    const { getByTestId, getByText } = RTL.render(<RemConverter />);
    RTL.fireEvent.change(getByTestId("px"), {
      target: { value: "32" },
    });
    RTL.fireEvent.click(getByText("Convert"));
    expect((getByTestId("rem") as HTMLInputElement).value).toBe("2");
  });
});
