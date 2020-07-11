import * as React from "react";
import * as T from "@workshop/common/exercises/03-better-promise";
import { pipe } from "@workshop/common/exercises/01-pipe";
import { useLocalTracer } from "./01-local-context";

export const AsyncCounter = () => {
  const [count, setCount] = React.useState(0);
  const { leave, tracedRunPromise } = useLocalTracer();

  const increment = () => {
    pipe(
      T.sleep(1000),
      T.chain(() =>
        T.sync(() => {
          setCount((current) => current + 1);
        })
      ),
      tracedRunPromise
    );
  };

  const decrement = () => {
    pipe(
      T.sleep(1000),
      T.chain(() =>
        T.sync(() => {
          setCount((current) => current - 1);
        })
      ),
      tracedRunPromise
    );
  };

  React.useEffect(() => {
    return () => {
      leave();
    };
  }, []);

  return (
    <>
      <button onClick={() => decrement()}>-</button>
      <span>{count}</span>
      <button onClick={() => increment()}>+</button>
    </>
  );
};

export const AutoIncrementAsync = () => {
  const [count, setCount] = React.useState(0);

  const increment = pipe(
    T.fromCallback<never, void>((res) => {
      setTimeout(() => {
        res();
      }, 100);
    }),
    T.chain(() =>
      T.sync(() => {
        setCount((c) => c + 1);
      })
    )
  );

  React.useEffect(() => {
    const interruptors = new Set<() => void>();
    const interval = setInterval(() => {
      const cancel = pipe(
        increment,
        T.runAsync(() => {
          interruptors.delete(cancel);
        })
      );
      interruptors.add(cancel);
    }, 500);
    return () => {
      clearInterval(interval);
      interruptors.forEach((i) => {
        i();
      });
    };
  }, []);

  return (
    <>
      <span>{count}</span>
    </>
  );
};
