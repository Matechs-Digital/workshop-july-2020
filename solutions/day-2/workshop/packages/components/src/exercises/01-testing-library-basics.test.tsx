import * as React from "react";
import * as ReactDom from "react-dom";
import * as dom from "@testing-library/dom";
import * as rtl from "@testing-library/react";
import {
  Message,
  Counter,
  AsyncCounter,
  AutoIncrement,
  AutoIncrementAsync,
} from "./01-testing-library-basics";
import * as timers from "./01-timers";
import { act } from "react-dom/test-utils";

afterEach(rtl.cleanup);

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("01-testing-library-basics", () => {
  /**
   * Add to your jest.config.js:
   *
   * transform: {
   *  '^.+\\.tsx?$': 'ts-jest',
   * }
   */

  /**
   * Exercise 1
   *
   * Without using any library except react, react-dom & jest
   */
  it("assert that Message renders a div with the correct message inside", () => {
    const container = document.createElement("div");

    ReactDom.render(<Message message={"hello"} />, container);

    expect(
      container.querySelector("div [data-testid='message-box']")?.innerHTML
    ).toBe("hello");
  });

  /**
   * Install @testing-library/dom in the workspace root as a devDependency
   */

  /**
   * Exercise 2
   *
   * Rewrite exercise 1 using @testing-library/dom to query the div containing the message
   */
  it("assert that Message renders a div with the correct message inside (dom-testing-library)", () => {
    const container = document.createElement("div");

    ReactDom.render(<Message message={"hello"} />, container);

    expect(dom.getByTestId(container, "message-box").innerHTML).toBe("hello");
  });

  /**
   * Install @testing-library/react in the workspace root as a devDependency
   */

  /**
   * Exercise 3
   *
   * Rewrite exercise 2 using @testing-library/react to render the react component
   */
  it("assert that Message renders a div with the correct message inside (react-testing-library)", () => {
    const { getByTestId } = rtl.render(<Message message={"hello"} />);

    expect(getByTestId("message-box").innerHTML).toBe("hello");
  });

  /**
   * Install @testing-library/jest-dom, add to jest.config.js:
   *
   * setupFilesAfterEnv: ["./jest.setup.ts"]
   */

  /**
   * Create jest.setup.ts with:
   * import "@testing-library/jest-dom";
   */

  /**
   * Exercise 4
   *
   * Rewrite exercise 3 using @testing-library/jest-dom perform the assertion
   */
  it("assert that Message renders a div with the correct message inside (jest-dom-testing-library)", () => {
    const { getByTestId } = rtl.render(<Message message={"hello"} />);

    expect(getByTestId("message-box")).toContainHTML("hello");
  });

  /**
   * Exercise 5
   */
  it("assert that clicking on the + button of the Counter component leads to an increment", () => {
    const { getByText } = rtl.render(<Counter />);

    const increment = getByText("+");
    const counter = getByText("0");

    expect(counter).toContainHTML("0");

    act(() => {
      increment.click();
    });

    expect(counter).toContainHTML("1");
  });

  /**
   * Exercise 6:
   * use getByTestId
   */
  it.todo(
    "assert that clicking on the + button of the Counter component leads to an increment - 2"
  );

  /**
   * Exercise 7:
   * without the usage of findBy*
   */
  it.todo(
    "assert that clicking on the + button of the AsyncCounter component leads to an increment"
  );

  /**
   * Exercise 8:
   * using findBy* to wait
   */
  it("assert that clicking on the + button of the AsyncCounter component leads to an increment - 2", async () => {
    const R = rtl.render(<AsyncCounter />);

    const increment = R.getByText("+");
    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    await act(async () => {
      increment.click();

      await R.findByText(
        "1",
        {},
        {
          timeout: 2000,
        }
      );
    });

    expect(counter).toContainHTML("1");
  });

  /**
   * Exercise 9:
   * bring down test time to < 100ms
   */
  it("assert that clicking on the + button of the AsyncCounter component leads to an increment - 3", () => {
    jest.useFakeTimers();

    const R = rtl.render(<AsyncCounter />);

    const increment = R.getByText("+");
    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    act(() => {
      increment.click();

      jest.advanceTimersByTime(2000);
    });

    expect(counter).toContainHTML("1");
  });

  /**
   * Exercise 10
   */
  it("assert that AutoIncrement increments after 5 seconds", () => {
    jest.useFakeTimers();

    const R = rtl.render(<AutoIncrement />);

    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(counter).toContainHTML("1");

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(counter).toContainHTML("2");

    R.unmount();
  });

  /**
   * Exercise 11
   */
  it("assert that AutoIncrement increments each 5 seconds for a minimum of 3 times", () => {
    jest.useFakeTimers();

    const R = rtl.render(<AutoIncrement />);

    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(counter).toContainHTML("1");

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(counter).toContainHTML("2");

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(counter).toContainHTML("3");

    R.unmount();
  });

  /**
   * Exercise 12
   */
  it.skip("assert that AutoIncrementAsync increments each 5 seconds", async () => {
    const R = rtl.render(<AutoIncrementAsync />);

    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    await act(async () => {
      await new Promise((r) => {
        setTimeout(() => {
          r();
        }, 5500);
      });
    });

    expect(counter).toContainHTML("1");
  }, 10000);

  /**
   * Exercise 13
   */
  it.skip("assert that AutoIncrementAsync increments each 5 seconds in < 2000ms", async () => {
    const R = rtl.render(<AutoIncrementAsync interval={1000} />);

    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    await act(async () => {
      await new Promise((r) => {
        setTimeout(() => {
          r();
        }, 5500);
      });
    });

    expect(counter).toContainHTML("1");
  }, 10000);

  /**
   * Exercise 14
   */
  it("assert that AutoIncrementAsync increments each 5 seconds in < 200ms", async () => {
    const spyInterval = jest.spyOn(timers, "interval");
    const spyTimeout = jest.spyOn(timers, "timeout");

    spyInterval.mockImplementation((task) => {
      return setInterval(() => {
        task();
      }, 50);
    });

    spyTimeout.mockImplementation((task) => {
      return setTimeout(() => {
        task();
      }, 10);
    });

    const R = rtl.render(<AutoIncrementAsync />);

    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    await act(async () => {
      await new Promise((r) => {
        setTimeout(() => {
          r();
        }, 100);
      });
    });

    expect(counter).toContainHTML("1");

    R.unmount();
  });

  /**
   * Exercise 15
   */
  it("assert that AutoIncrementAsync increments each 5 seconds in < 50ms", async () => {
    jest.useFakeTimers();

    const R = rtl.render(<AutoIncrementAsync />);

    const counter = R.getByText("0");

    expect(counter).toContainHTML("0");

    await act(async () => {
      jest.advanceTimersByTime(5200);

      jest.useRealTimers();

      await new Promise((r) => {
        setTimeout(() => {
          r();
        }, 10);
      });
    });

    expect(counter).toContainHTML("1");

    R.unmount();
  });
});
