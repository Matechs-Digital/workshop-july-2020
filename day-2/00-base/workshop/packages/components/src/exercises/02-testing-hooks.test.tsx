import * as React from "react";
import { useCounter, useAsyncCounter } from "./02-testing-hooks";
import { render, act } from "@testing-library/react";
import { renderHook } from "./02-render-hook";
import * as RTH from "@testing-library/react-hooks";

describe("02-testing-hooks", () => {
  /**
   * Exercise 1:
   * with sole usage of @testing-library/react
   */
  it("assert that useCounter increments the count correctly", () => {
    const current: {
      value: ReturnType<typeof useCounter> | undefined;
    } = {
      value: undefined,
    };

    function HookView() {
      const h = useCounter();
      current.value = h;
      React.useEffect(() => {
        current.value = h;
      }, [h]);
      return null;
    }

    const {} = render(<HookView />);

    expect(current.value?.count).toBe(0);

    act(() => {
      current.value?.increment();
    });

    expect(current.value?.count).toBe(1);
  });

  /**
   * Exercise 2:
   * with sole usage of @testing-library/react
   */
  it("asserts that useAsyncCounter increments the count correctly", async () => {
    const current: {
      value: ReturnType<typeof useCounter> | undefined;
    } = {
      value: undefined,
    };

    const listeners = [] as (() => void)[];

    function HookView() {
      const h = useAsyncCounter(1000);
      current.value = h;
      React.useEffect(() => {
        current.value = h;
        listeners.forEach((f) => {
          f();
        });
      }, [h]);
      return null;
    }

    const waitForNextUpdate = () =>
      new Promise((r) => {
        listeners.push(() => {
          r();
        });
      });

    const {} = render(<HookView />);

    expect(current.value?.count).toBe(0);

    await act(async () => {
      current.value?.increment();

      await waitForNextUpdate();
    });

    expect(current.value?.count).toBe(1);
  });

  /**
   * Exercise 3:
   * without usage of fake timers
   */
  it("asserts that useAsyncCounter increments the count correctly - async tracking", async () => {
    jest.useFakeTimers();
    const { current } = renderHook(() => useAsyncCounter(1000));

    expect(current.value.count).toBe(0);

    await act(async () => {
      current.value.increment();
      const p = current.waitForNextUpdate();
      jest.advanceTimersByTime(1000);
      jest.useRealTimers();
      await p;
    });

    expect(current.value?.count).toBe(1);
  });

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
  it.todo("test useAsyncAutoIncrement using renderHook from RTL");

  /**
   * Exercise 7:
   * Try to use fakeTimers with RTL
   */
  it("test useAsyncAutoIncrement using renderHook from RTL with defaults at 5 seconds", async () => {
    jest.useFakeTimers();
    const { result, waitForNextUpdate } = RTH.renderHook(() =>
      useAsyncCounter(1000)
    );

    expect(result.current.count).toBe(0);

    await act(async () => {
      result.current.increment();
      const p = waitForNextUpdate();
      jest.advanceTimersByTime(1000);
      jest.useRealTimers();
      await p;
    });

    expect(result.current.count).toBe(1);
  });
});
