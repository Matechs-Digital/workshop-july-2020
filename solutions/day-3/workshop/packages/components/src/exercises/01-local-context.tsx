import * as React from "react";
import * as T from "@workshop/common/exercises/03-better-promise";
import { pipe } from "@workshop/common/exercises/01-pipe";

// tracks a set of computations running them interruptibly
export class LocalContext {
  // track the interruptors
  private store = new Set<() => void>();
  private tracer = new T.Tracer();

  constructor() {
    this.traced = this.traced.bind(this);
    this.leave = this.leave.bind(this);
    this.wait = this.wait.bind(this);
  }

  // create a traced task
  traced<E, A>(task: T.Task<E, A>): T.Task<E, A> {
    return (is) =>
      new T.CancelablePromise(
        this.tracer.traced(() => {
          return new Promise((res, rej) => {
            // runs the computation in async mode
            const cancel = pipe(
              task,
              T.runAsync((ex) => {
                setTimeout(() => {
                  // cleanup interruptor from store
                  this.store.delete(cancel);

                  // propagate exit
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

            // track the interruptor
            this.store.add(cancel);
          });
        }),
        is
      );
  }

  wait() {
    return this.tracer.wait();
  }

  leave() {
    // copy the interruptors
    const interruptors = Array.from(this.store);

    // clear the store
    this.store.clear();

    // call each interruptor
    interruptors.forEach((i) => {
      i();
    });
  }
}

// expose a LocalContext using a react custom hook
export const useLocalTracer = () => {
  // keeps the context in a reference
  const {
    current: { leave, traced, wait },
  } = React.useRef(new LocalContext());

  // run a task as a traced promise of the exit state
  const tracedRunPromise = <E, A>(task: T.Task<E, A>) =>
    pipe(task, traced, T.runPromise);

  // interrupt everything on unmount
  React.useEffect(() => {
    return () => {
      leave();
    };
  }, []);

  return {
    traced,
    tracedRunPromise,
    wait,
  };
};
