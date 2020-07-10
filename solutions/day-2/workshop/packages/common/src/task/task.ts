import { pipe } from "../utils/pipe";

export interface Success<A> {
  _tag: "Success";
  a: A;
}

export interface Failure<E> {
  _tag: "Failure";
  e: E;
}

export interface Interrupt {
  _tag: "Interrupt";
}

export type Rejection<E> = Failure<E> | Interrupt;

export type Exit<E, A> = Rejection<E> | Success<A>;

export class InterruptiblePromise<E, A> {
  readonly _E!: () => E;
  private rejection: ((e: any) => void) | undefined = undefined;

  private interrupted = false;

  constructor(readonly f: () => Promise<A>) {}

  readonly promise: () => Promise<A> = () =>
    new Promise((res, rej) => {
      this.rejection = rej;
      this.f()
        .then((a) => {
          if (!this.interrupted) {
            res(a);
          }
        })
        .catch((e) => {
          if (!this.interrupted) {
            rej(e);
          }
        });
    });

  readonly interrupt = () => {
    if (!this.interrupted && this.rejection) {
      this.interrupted = true;
      this.rejection?.(interrupt);
    }
  };
}

export interface Task<E, A> {
  (): InterruptiblePromise<E, A>;
}

export const failure = <E>(e: E): Rejection<E> => ({
  _tag: "Failure",
  e,
});

export const interrupt: Exit<never, never> = {
  _tag: "Interrupt",
};

export const success = <A>(a: A): Exit<never, A> => ({
  _tag: "Success",
  a,
});

export const chain = <A, EA, B, EB>(f: (_: A) => Task<EB, B>) => (
  self: Task<EA, A>
): Task<EA | EB, B> => () =>
  new InterruptiblePromise(() =>
    self()
      .promise()
      .then((a) => f(a)().promise())
  );

export const tap = <A, EA, B, EB>(f: (_: A) => Task<EB, B>) => (
  self: Task<EA, A>
): Task<EA | EB, A> => () =>
  new InterruptiblePromise(() =>
    self()
      .promise()
      .then((a) =>
        f(a)()
          .promise()
          .then(() => a)
      )
  );

export const map = <A, B>(f: (_: A) => B) => <E>(
  self: Task<E, A>
): Task<E, B> => () =>
  new InterruptiblePromise(() =>
    self()
      .promise()
      .then((a) => f(a))
  );

export const sync = <A>(f: () => A): Task<never, A> => () =>
  new InterruptiblePromise(() => Promise.resolve(f()));

export const succeed = <A>(a: A): Task<never, A> => () =>
  new InterruptiblePromise(() => Promise.resolve(a));

export const fail = <E>(e: E): Task<E, never> => () =>
  new InterruptiblePromise(() =>
    Promise.reject({
      _tag: "Failure",
      e,
    })
  );

export const fromPromise = <E>(onError: (u: unknown) => E) => <A>(
  p: () => Promise<A>
): Task<E, A> => () =>
  new InterruptiblePromise(() =>
    p().catch((e) => Promise.reject({ _tag: "Failure", e: onError(e) }))
  );

export const fromTryCatch = <E>(onError: (u: unknown) => E) => <A>(
  p: () => A
): Task<E, A> => {
  return () =>
    new InterruptiblePromise(() => {
      try {
        return Promise.resolve(p());
      } catch (e) {
        return Promise.reject(failure(onError(e)));
      }
    });
};

export const fromNonFailingPromise = <A>(
  p: () => Promise<A>
): Task<never, A> => () => new InterruptiblePromise(p);

export const handle = <E = never, E1 = never, B = unknown>(
  f: (e: E) => Task<E1, B>
) => <A>(self: Task<E, A>): Task<E1, A | B> => () =>
  new InterruptiblePromise(() =>
    self()
      .promise()
      .catch((e: Rejection<E>) => {
        switch (e._tag) {
          case "Failure": {
            return f(e.e)().promise();
          }
          case "Interrupt": {
            return Promise.reject(e);
          }
        }
      })
  );

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

export function all<E, A>(a: Task<E, A>[]): Task<E, A[]> {
  return () =>
    new InterruptiblePromise(() => Promise.all(a.map((p) => p().promise())));
}

export const fold = <A, E, E1, A1, E2, A2>(
  f: (e: E) => Task<E1, A1>,
  g: (a: A) => Task<E2, A2>
) => (self: Task<E, A>): Task<E1 | E2, A1 | A2> => () =>
  new InterruptiblePromise(() =>
    self()
      .promise()
      .then((a) => g(a)().promise())
      .catch((e: Rejection<E>) => {
        switch (e._tag) {
          case "Failure": {
            return f(e.e)().promise();
          }
          case "Interrupt": {
            return Promise.reject(e);
          }
        }
      })
  );

export const result = <E, A>(task: Task<E, A>): Task<never, Exit<E, A>> =>
  pipe(
    task,
    fold(
      (e) => succeed(failure(e)),
      (a) => succeed(success(a))
    )
  );

export const of = succeed({});

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

export const fromCallback = <E = never, A = unknown>(
  f: (resolve: (res: A) => void, reject: (error: E) => void) => void
): Task<E, A> => () =>
  new InterruptiblePromise(
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
      })
  );
