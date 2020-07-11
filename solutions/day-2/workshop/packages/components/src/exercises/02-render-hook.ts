import { render } from "@testing-library/react";
import * as React from "react";

class Current<T> {
  public value!: T;
  listeners = new Set<() => void>();

  constructor() {
    this.waitForNextUpdate = this.waitForNextUpdate.bind(this);
    this.setValue = this.setValue.bind(this);
    this.listen = this.listen.bind(this);
  }

  setValue(value: T) {
    this.value = value;

    Array.from(this.listeners).forEach((l) => {
      l();
    });
  }

  listen(listen: () => void) {
    this.listeners.add(listen);

    return () => {
      this.listeners.delete(listen);
    };
  }

  readonly waitForNextUpdate = () =>
    new Promise<void>((r) => {
      const cancel = this.listen(() => {
        setImmediate(() => {
          cancel();
          r(undefined);
        });
      });
    });
}

export function renderHook<T>(useCustom: () => T) {
  const HookView = (p: { current: Current<T> }) => {
    const hook = useCustom();

    p.current.setValue(hook);

    React.useEffect(() => {
      p.current.setValue(hook);
    }, [hook]);

    return null;
  };

  const p = new Current<T>();
  const r = render(React.createElement(HookView, { current: p }));

  return {
    current: p,
    ...r,
  };
}
