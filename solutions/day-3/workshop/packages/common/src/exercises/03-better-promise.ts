import { pipe } from "./01-pipe";

/**
 * The Async Problem
 */

/**
 * During the last part of day-2 when we started to test async code we noticed
 * already a few problems with promises, namely:
 * - Promises don't interrupt
 * - Promises are hard to track
 *
 * We didn't notice further issues because all the tests we wrote were testing the
 * happy path of components or happy paths of computations.
 *
 * The key problematic, Promise don't carry type informations on the error channel.
 */

/**
 * The reasons behind this great miss is that the API of promises is Fluent based, that makes
 * handling the Error channel as a union type impossible.
 *
 * The other reason is support of async/await to make imperative code possible
 */

/**
 * The Goal,
 *
 * We would like to have a data type Task<E, A> where
 * - E represents a potential Error
 * - A represents a potential Success
 *
 * That is:
 * - Lazy
 * - Supports interruption
 * - Carry the types of both success and failure properly
 */

/**
 * Step 1, The Data Type
 */

export interface Task<E, A> {
  (_: InterruptionState): CancelablePromise<E, A>;
}

/**
 * Models the state of interruption, allows for listening to interruption events & firing interruption events
 */
export class InterruptionState {
  private isInterrupted = false;
  readonly listeners = new Set<() => void>();

  // listen to an interruption event
  listen(f: () => void) {
    this.listeners.add(f);
    return () => {
      // stop listening
      this.listeners.delete(f);
    };
  }

  get interrupted() {
    return this.isInterrupted;
  }

  interrupt() {
    // set to interrupted
    this.isInterrupted = true;
    // notify
    this.listeners.forEach((i) => {
      i();
    });
  }
}

export interface Failure<E> {
  readonly _tag: "Failure";
  e: E;
}

export interface Interrupt {
  readonly _tag: "Interrupt";
}

export interface Success<A> {
  readonly _tag: "Success";
  a: A;
}

export type Rejection<E> = Failure<E> | Interrupt;

export type Exit<E, A> = Rejection<E> | Success<A>;

export const failure = <E>(e: E): Rejection<E> => ({
  _tag: "Failure",
  e,
});

export const interrupt: Rejection<never> = {
  _tag: "Interrupt",
};

export const success = <A>(a: A): Exit<never, A> => ({
  _tag: "Success",
  a,
});

export class CancelablePromise<E, A> {
  // holds the type information of E
  readonly _E!: () => E;

  // gets called with a Rejection<E>, any here is to not break covariance imposed by _E
  private rejection: ((e: Rejection<any>) => void) | undefined = undefined;

  // holds the current running promise
  private current: Promise<A> | undefined = undefined;

  constructor(
    // creates the promise
    readonly promiseFactory: () => Promise<A>,
    // listens for interruption events
    readonly is: InterruptionState
  ) {}

  // creates the computation linking it to the interruption state
  readonly promise: () => Promise<A> = () => {
    if (this.current) {
      throw new Error("Bug: promise() have been called twice");
    } else if (this.is.interrupted) {
      throw new Error("Bug: trying to create a promise already interrupted");
    } else {
      // we record the current interrupt in the interruption registry
      const removeListener = this.is.listen(() => {
        this.interrupt();
      });
      const p = new Promise<A>((res, rej) => {
        // set the rejection handler
        this.rejection = rej;

        // creates the underlying promise
        this.promiseFactory()
          .then((a) => {
            // removes the call to interrupt from the interruption registry
            removeListener();
            // if not interrupted we continue
            if (!this.is.interrupted) {
              res(a);
            }
          })
          .catch((e) => {
            // removes the call to interrupt from the interruption registry
            removeListener();
            // if not interrupted we continue
            if (!this.is.interrupted) {
              rej(e);
            }
          });
      });
      // track the current running promise to avoid re-creation
      this.current = p;

      // return the promise
      return p;
    }
  };

  readonly interrupt = () => {
    // triggeres a promise rejection on the current promise with an interrupt exit
    this.rejection?.(interrupt);
  };
}

/**
 * Step 2, Tracking
 */

export class Tracer {
  private running = new Set<Promise<any>>();

  constructor() {
    this.traced = this.traced.bind(this);
    this.wait = this.wait.bind(this);
    this.clear = this.clear.bind(this);
  }

  // tracks a lazy promise lifetime
  traced<A>(promise: () => Promise<A>) {
    return async () => {
      const p = promise();
      this.running.add(p);

      try {
        const a = await p;
        this.running.delete(p);
        return Promise.resolve(a);
      } catch (e) {
        this.running.delete(p);
        return Promise.reject(e);
      }
    };
  }

  // awaits for all the running promises to complete
  async wait(): Promise<Exit<any, any>[]> {
    const t = await Promise.all(
      Array.from(this.running).map((p) =>
        p.then((a) => success(a)).catch((e) => Promise.resolve(e))
      )
    );
    return await new Promise((r) => {
      setTimeout(() => {
        r(t);
      }, 0);
    });
  }

  // clears itself
  clear() {
    this.running.clear();
  }
}

// create the root tracing context
export const tracingContext = new Tracer();

/**
 * Step 3, Running
 */

// runs the cancellable promise in a tracing context
// folds the result to an Exit state
const runCancelablePromise = <E, A>(
  task: CancelablePromise<E, A>
): Promise<Exit<E, A>> =>
  tracingContext
    .traced(task.promise)()
    .then((a) => success(a))
    .catch((e: Rejection<E>) => Promise.resolve(e));

// runs as a Promise of an Exit
export const runPromise = <E, A>(task: Task<E, A>): Promise<Exit<E, A>> =>
  runCancelablePromise(task(new InterruptionState()));

// runs as a Cancellable task
export const runAsync = <E, A>(cb?: (e: Exit<E, A>) => void) => (
  task: Task<E, A>
) => {
  const is = new InterruptionState();
  const interruptible = task(is);
  const running = runCancelablePromise(interruptible);

  running.then((e) => {
    cb?.(e);
  });

  return () => {
    is.interrupt();
  };
};

/**
 * Step 4, Constructors
 */

// construct a Task from a sync computation that is not supposed to fail
export const sync = <A>(f: () => A): Task<never, A> => (is) =>
  new CancelablePromise(() => Promise.resolve(f()), is);

// construct a Task from a value
export const succeed = <A>(a: A): Task<never, A> => (is) =>
  new CancelablePromise(() => Promise.resolve(a), is);

// construct a Task from an error
export const fail = <E>(e: E): Task<E, never> => (is) =>
  new CancelablePromise(
    () =>
      Promise.reject({
        _tag: "Failure",
        e,
      }),
    is
  );

// construct an empty task of {}
// useful to combine with bind & assign
export const of = succeed({});

// construct a Task from a promise that can fail
// need to specify the action to take on error
export const fromPromise = <E>(onError: (u: unknown) => E) => <A>(
  p: () => Promise<A>
): Task<E, A> => (is) =>
  new CancelablePromise(
    () => p().catch((e) => Promise.reject({ _tag: "Failure", e: onError(e) })),
    is
  );

// like fromPromise but for sync code that can throw
export const fromTryCatch = <E>(onError: (u: unknown) => E) => <A>(
  p: () => A
): Task<E, A> => {
  return (is) =>
    new CancelablePromise(() => {
      try {
        return Promise.resolve(p());
      } catch (e) {
        return Promise.reject(failure(onError(e)));
      }
    }, is);
};

// construct a Task from a promise that cannot fail
export const fromNonFailingPromise = <A>(
  p: () => Promise<A>
): Task<never, A> => (is) => new CancelablePromise(p, is);

// represent a callback
export type Cb<A> = (a: A) => void;

// construct a Task from an async callback (like new Promise())
export const fromCallback = <E = never, A = void>(
  f: (resolve: (res: A) => void, reject: (error: E) => void) => void
): Task<E, A> => (is) =>
  new CancelablePromise(
    () =>
      new Promise<A>((res, rej) => {
        f(
          (result) => {
            res(result);
          },
          (err) => {
            rej(failure(err));
          }
        );
      }),
    is
  );

/**
 * Step 5, Combinators
 */

// like .then in Promise when the inner result is a Promise
export const chain = <A, EA, B, EB>(f: (_: A) => Task<EB, B>) => (
  self: Task<EA, A>
): Task<EA | EB, B> => (is) =>
  new CancelablePromise(() => {
    const task = self(is);

    return task.promise().then((a) => f(a)(is).promise());
  }, is);

// like .then in Promise when the result of f is a Promise but ignores the outout of f
// useful for logging or doing things that should not change the result
export const tap = <A, EA, B, EB>(f: (_: A) => Task<EB, B>) => (
  self: Task<EA, A>
): Task<EA | EB, A> => (is) =>
  new CancelablePromise(
    () =>
      self(is)
        .promise()
        .then((a) =>
          f(a)(is)
            .promise()
            .then(() => a)
        ),
    is
  );

// like .then in Promise when the result of f is a value
export const map = <A, B>(f: (_: A) => B) => <E>(
  self: Task<E, A>
): Task<E, B> => (is) =>
  new CancelablePromise(
    () =>
      self(is)
        .promise()
        .then((a) => f(a)),
    is
  );

// like .catch in Promise
export const handle = <E = never, E1 = never, B = unknown>(
  f: (e: E) => Task<E1, B>
) => <A>(self: Task<E, A>): Task<E1, A | B> => (is) =>
  new CancelablePromise(
    () =>
      self(is)
        .promise()
        .catch((e: Rejection<E>) => {
          switch (e._tag) {
            case "Failure": {
              return f(e.e)(is).promise();
            }
            case "Interrupt": {
              return Promise.reject(e);
            }
          }
        }),
    is
  );

// like .then + .catch
export const fold = <A, E, E1, A1, E2, A2>(
  f: (e: E) => Task<E1, A1>,
  g: (a: A) => Task<E2, A2>
) => (self: Task<E, A>): Task<E1 | E2, A1 | A2> => (is) =>
  new CancelablePromise(
    () =>
      self(is)
        .promise()
        .then((a) => g(a)(is).promise())
        .catch((e: Rejection<E>) => {
          switch (e._tag) {
            case "Failure": {
              return f(e.e)(is).promise();
            }
            case "Interrupt": {
              return Promise.reject(e);
            }
          }
        }),
    is
  );

// logically runs the operation and return its exit
export const result = <E, A>(task: Task<E, A>): Task<never, Exit<E, A>> =>
  pipe(
    task,
    fold(
      (e) => succeed(failure(e)),
      (a) => succeed(success(a))
    )
  );

// like Promise.all
export function all<E, A>(a: Task<E, A>[]): Task<E, A[]> {
  return (is) =>
    new CancelablePromise(() => Promise.all(a.map((p) => p(is).promise())), is);
}

// like Promise.all for tuples
export function sequence<Tasks extends Task<any, any>[]>(
  ...tasks: Tasks
): Task<
  {
    [k in keyof Tasks]: [Tasks[k]] extends [Task<infer E, any>] ? E : never;
  }[number],
  { [k in keyof Tasks]: [Tasks[k]] extends [Task<any, infer A>] ? A : never }
> {
  return all(tasks) as any;
}

// like Promise.all + map on steroids
export const foreach = <A, E1, B>(f: (a: A) => Task<E1, B>) => (
  as: Iterable<A>
) => all(Array.from(as).map(f));

// binds the output of a computation to a variable
// useful for imperative style, like using async/await
export const bind = <K extends string>(k: K) => <S, E1, A1>(
  f: (s: S) => Task<E1, A1>
) => <E>(self: Task<E, S>): Task<E | E1, S & { [k in K]: A1 }> =>
  pipe(
    self,
    chain((s) =>
      pipe(
        f(s),
        map((a1) => ({ ...s, [k]: a1 } as S & { [k in K]: A1 }))
      )
    )
  );

// binds the result of a function to a variable
// useful for imperative style, like using async/await
export const assign = <K extends string>(k: K) => <S, A1>(f: (s: S) => A1) => <
  E
>(
  self: Task<E, S>
): Task<E, S & { [k in K]: A1 }> =>
  pipe(
    self,
    map((s) => pipe(f(s), (a1) => ({ ...s, [k]: a1 } as S & { [k in K]: A1 })))
  );

// sleeps
export const sleep = (ms: number) =>
  fromCallback<never, void>((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });

// delayed
export const delayed = (ms: number) => <E, A>(task: Task<E, A>) =>
  pipe(
    sleep(ms),
    chain(() => task)
  );
