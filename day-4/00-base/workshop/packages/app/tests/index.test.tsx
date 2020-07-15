import App from "@workshop/app/pages";
import ReactDOM from "react-dom";
import React from "react";

describe("app / index", () => {
  it("should contain correct content", () => {
    const container = document.createElement("div");
    ReactDOM.render(<App />, container);
  });
});
