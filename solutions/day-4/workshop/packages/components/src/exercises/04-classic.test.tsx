import * as React from "react";
import * as RTL from "@testing-library/react";
import { RemConverter } from "./04-generative-react";

afterEach(RTL.cleanup);

describe("04-classic", () => {
  it("should render correctly", () => {
    expect(RTL.render(<RemConverter />)).toBeDefined();
  });

  it("should convert px to the right rem value", async () => {
    const { getByTestId, getByText } = RTL.render(<RemConverter />);
    RTL.fireEvent.change(getByTestId("px"), {
      target: { value: "32" },
    });
    RTL.fireEvent.click(getByText("Convert"));
    expect((getByTestId("rem") as HTMLInputElement).value).toBe("2");
  });
});
