import * as React from "react";
import * as RTL from "@testing-library/react";
import fc from "fast-check";
import { RemConverter } from "./04-generative-react";

afterEach(RTL.cleanup);

describe("04-generative-react", () => {
  /**
   * Exercise 1 (2 mins)
   */
  it("should render correctly", () => {
    expect(RTL.render(<RemConverter />)).toBeDefined();
  });

  /**
   * Exercise 2 (5 mins)
   */
  it("should convert px to the right rem value", async () => {
    const { getByTestId, getByText } = RTL.render(<RemConverter />);
    RTL.fireEvent.change(getByTestId("px"), {
      target: { value: "32" },
    });
    RTL.fireEvent.click(getByText("Convert"));
    expect((getByTestId("rem") as HTMLInputElement).value).toBe("2");
  });

  /**
   * Exercise 3 (5 mins)
   */
  it("should convert px to rem using property based assertion", async () => {
    const { getByTestId, getByText } = RTL.render(<RemConverter />);
    fc.assert(
      fc.property(fc.nat(), fc.constant(16), (px, baseFontSize) => {
        RTL.fireEvent.change(getByTestId("px"), {
          target: { value: `${px}` },
        });
        RTL.fireEvent.click(getByText("Convert"));
        expect((getByTestId("rem") as HTMLInputElement).value).toBe(
          `${px / baseFontSize}`
        );
      })
    );
  });

  /**
   * Exercise 3 (10 mins)
   * Look at how to improve the 01-organizations.test.tsx using the generative approach
   */
});
