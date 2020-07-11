import * as React from "react";
import { render, act } from "@testing-library/react";
import { renderHook as rtlRenderHook } from "@testing-library/react-hooks";
import { renderHook } from "./02-render-hook";
import {
  useCounter,
  useAsyncCounter,
  useAsyncAutoIncrement,
} from "./02-testing-hooks";

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("02-testing-hooks", () => {
  /**
   * Exercise 1:
   * with sole usage of @testing-library/react
   */
  it("test useCounter increment updates the count correctly", () => {
    const HookView = (p: {
      current: { value: ReturnType<typeof useCounter> };
    }) => {
      const hook = useCounter();

      p.current.value = hook;

      return null;
    };

    const p: {
      current: {
        value: ReturnType<typeof useCounter>;
      };
    } = {
      current: {
        value: undefined as any,
      },
    };

    const { unmount } = render(React.createElement(HookView, p));

    expect(p.current.value.count).toBe(0);

    act(() => {
      p.current.value.increment();
    });

    expect(p.current.value.count).toBe(1);

    unmount();
  });

  /**
   * Exercise 2:
   * with sole usage of @testing-library/react
   */
  it("test useAsyncCounter increment updates the count correctly", () => {
    jest.useFakeTimers();

    const HookView = (p: {
      current: { value: ReturnType<typeof useCounter> };
    }) => {
      const hook = useAsyncCounter();

      p.current.value = hook;

      return null;
    };

    const p: {
      current: {
        value: ReturnType<typeof useCounter>;
      };
    } = {
      current: {
        value: undefined as any,
      },
    };

    const { unmount } = render(React.createElement(HookView, p));

    expect(p.current.value.count).toBe(0);

    act(() => {
      p.current.value.increment();
      jest.advanceTimersByTime(6000);
    });

    expect(p.current.value.count).toBe(1);

    unmount();
  });

  /**
   * Exercise 3:
   * without usage of fake timers
   */
  it("test useAsyncCounter increment updates the count correctly - async tracking", async () => {
    const { unmount, current } = renderHook(() => useAsyncCounter(100));

    expect(current.value.count).toBe(0);

    await act(async () => {
      current.value.increment();
      await current.waitForNextUpdate();
    });

    expect(current.value.count).toBe(1);

    unmount();
  });

  /**
   * Exercise 4
   */
  it("test useAsyncAutoIncrement asserting that it updates correctly", async () => {
    const { unmount, current } = renderHook(() =>
      useAsyncAutoIncrement(10, 100)
    );

    expect(current.value.count).toBe(0);

    await act(current.waitForNextUpdate);

    expect(current.value.count).toBe(1);

    await act(current.waitForNextUpdate);

    expect(current.value.count).toBe(2);

    unmount();
  });

  /**
   * Exercise 5
   */
  it("test useAsyncAutoIncrement asserting that by defaults updates every 5 seconds", async () => {
    jest.useFakeTimers();

    const R = renderHook(() => useAsyncAutoIncrement());

    expect(R.current.value.count).toBe(0);

    const p = R.current.waitForNextUpdate();

    await act(async () => {
      jest.advanceTimersByTime(5500);
      await p;
    });

    expect(R.current.value.count).toBe(1);

    const p2 = R.current.waitForNextUpdate();

    await act(async () => {
      jest.advanceTimersByTime(5500);
      await p2;
    });

    expect(R.current.value.count).toBe(2);

    R.unmount();
  });

  /**
   * Install @testing-library/react-hooks & react-test-renderer into the workspace root as devDependency
   */

  /**
   * Exercise 6
   */
  it("test useAsyncAutoIncrement using renderHook from RTL", async () => {
    const { result, waitForNextUpdate, unmount } = rtlRenderHook(() =>
      useAsyncAutoIncrement(10, 50)
    );

    expect(result.current.count).toBe(0);

    const p = waitForNextUpdate();

    await act(async () => {
      await p;
    });

    expect(result.current.count).toBe(1);

    const p2 = waitForNextUpdate();

    await act(async () => {
      await p2;
    });

    expect(result.current.count).toBe(2);

    unmount();
  });

  /**
   * Exercise 7:
   * Try to use fakeTimers with RTL
   */
  it.todo(
    "test useAsyncAutoIncrement using renderHook from RTL defaults at 5 seconds"
  );
});
