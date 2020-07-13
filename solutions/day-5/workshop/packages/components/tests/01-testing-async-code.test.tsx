import * as React from "react";
import { AsyncCounter, AutoIncrementAsync } from "../src/01-testing-async-code";
import * as rtl from "@testing-library/react";
import * as T from "@workshop/common/previous/03-better-promise";
import { act } from "react-dom/test-utils";

afterEach(() => {
  jest.useRealTimers();
});

describe("01-testing-async-code", () => {
  /**
   * Exercise 1
   */
  it("assert that clicking on the + button of the AsyncCounter component leads to an increment", async () => {
    T.tracingContext.clear();

    const R = rtl.render(<AsyncCounter />);

    const increment = R.getByText("+");
    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    await rtl.act(async () => {
      increment.click();

      await T.tracingContext.wait();
    });

    expect(counter).toContainHTML("1");

    act(() => {
      increment.click();
    });

    await T.runPromise(T.sleep(200));

    R.unmount();

    await T.runPromise(T.sleep(2000));

    // note no act() warnings
  });

  /**
   * Exercise 2
   */
  it("assert that AsyncAutoIncrement increments itself", async () => {
    T.tracingContext.clear();

    const R = rtl.render(<AutoIncrementAsync />);

    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    await rtl.act(async () => {
      await T.runPromise(T.sleep(500));
      await T.tracingContext.wait();
    });

    expect(counter).toContainHTML("1");

    R.unmount();
  });

  /**
   * Exercise 3
   */
  it("assert that AsyncAutoIncrement increments itself with fake timers", async () => {
    T.tracingContext.clear();

    jest.useFakeTimers();

    const R = rtl.render(<AutoIncrementAsync />);

    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    jest.advanceTimersByTime(600);

    const p = T.tracingContext.wait();

    jest.useRealTimers();

    await rtl.act(async () => {
      await p;
    });

    expect(counter).toContainHTML("1");

    R.unmount();
  });
});
