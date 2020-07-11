import * as React from "react";
import * as T from "@workshop/common/exercises/03-better-promise";
import { pipe } from "@workshop/common/exercises/01-pipe";

export class LocalContext {
  private store = new Set<() => void>();

  constructor() {
    this.traced = this.traced.bind(this);
    this.leave = this.leave.bind(this);
  }

  traced<E, A>(task: T.Task<E, A>): T.Task<E, A> {
    return (is) =>
      new T.CancelablePromise(() => {
        return new Promise((res, rej) => {
          const cancel = pipe(
            task,
            T.runAsync((ex) => {
              setTimeout(() => {
                this.store.delete(cancel);

                switch (ex._tag) {
                  case "Success": {
                    res(ex.a);
                  }
                  case "Failure": {
                    rej(ex);
                  }
                  case "Interrupt": {
                    rej(ex);
                  }
                }
              }, 0);
            })
          );

          this.store.add(cancel);
        });
      }, is);
  }

  leave() {
    const interruptors = Array.from(this.store);
    this.store.clear();

    interruptors.forEach((i) => {
      i();
    });
  }
}

export const useLocalTracer = () => {
  const {
    current: { leave, traced },
  } = React.useRef(new LocalContext());

  const tracedRunPromise = <E, A>(task: T.Task<E, A>) =>
    pipe(task, traced, T.runPromise);

  return {
    leave,
    traced,
    tracedRunPromise,
  };
};
