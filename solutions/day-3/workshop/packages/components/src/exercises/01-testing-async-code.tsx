import * as React from "react";
import * as T from "@workshop/common/exercises/03-better-promise";
import { pipe } from "@workshop/common/exercises/01-pipe";
import { useExecutor } from "./01-local-context";

export const AsyncCounter = () => {
  const [count, setCount] = React.useState(0);
  const { runPromise } = useExecutor();

  const increment = () => {
    pipe(
      T.sync(() => {
        setCount((current) => current + 1);
      }),
      T.delayed(1000),
      runPromise
    );
  };

  const decrement = () => {
    pipe(
      T.sync(() => {
        setCount((current) => current - 1);
      }),
      T.delayed(1000),
      runPromise
    );
  };

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
  const { runPromise } = useExecutor();

  const increment = pipe(
    T.fromCallback((res: T.Cb<void>) => {
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
    const interval = setInterval(() => {
      runPromise(increment);
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <span>{count}</span>
    </>
  );
};
