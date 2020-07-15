import * as React from "react";
import {
  useCounter,
  useAsyncCounter,
  useAsyncAutoIncrement,
} from "./02-testing-hooks";
import { render, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

describe("02-testing-hooks", () => {
  /**
   * Exercise 1:
   * with sole usage of @testing-library/react
   */
  it("assert that useCounter increments the count correctly", () => {
    const ref: {
      current: ReturnType<typeof useCounter> | undefined;
    } = {
      current: undefined,
    };

    function HookView() {
      const h = useCounter();
      ref.current = h;
      return null;
    }

    render(<HookView />);

    act(() => {
      ref.current?.increment();
    });

    expect(ref.current?.count).toBe(1);
  });

  /**
   * Exercise 2:
   * with sole usage of @testing-library/react
   */
  it("asserts that useAsyncCounter increments the count correctly", async () => {
    const ref: {
      current: ReturnType<typeof useCounter> | undefined;
    } = {
      current: undefined,
    };

    const listeners: (() => void)[] = [];

    function HookView() {
      const h = useAsyncCounter(1000);
      ref.current = h;
      React.useEffect(() => {
        listeners.forEach((f) => {
          f();
        });
      }, [h]);
      return null;
    }

    render(<HookView />);

    await act(async () => {
      ref.current?.increment();

      await new Promise((r) => {
        listeners.push(() => {
          r();
        });
      });
    });

    expect(ref.current?.count).toBe(1);
  });

  /**
   * Exercise 3:
   * without usage of fake timers
   */
  it.todo(
    "asserts that useAsyncCounter increments the count correctly - async tracking"
  );

  /**
   * Exercise 4
   */
  it.todo("asserts that useAsyncAutoIncrement updates itself correctly");

  /**
   * Exercise 5
   */
  it.todo(
    "asserts that useAsyncAutoIncrement by defaults updates itself every 5 seconds"
  );

  /**
   * Install @testing-library/react-hooks & react-test-renderer into the workspace root as devDependency
   */

  /**
   * Exercise 6
   */
  it("test useAsyncAutoIncrement using renderHook from RTL", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncAutoIncrement(100, 200)
    );

    expect(result.current.count).toBe(0);

    await waitForNextUpdate();

    expect(result.current.count).toBe(1);
  });

  /**
   * Exercise 7:
   * Try to use fakeTimers with RTL
   */
  it.todo(
    "test useAsyncAutoIncrement using renderHook from RTL with defaults at 5 seconds"
  );
});
