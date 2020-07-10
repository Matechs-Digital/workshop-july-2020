import { pipe } from "../utils/pipe";

export interface Left<E> {
  _tag: "Left";
  e: E;
}

export interface Right<A> {
  _tag: "Right";
  a: A;
}

export type Either<E, A> = Left<E> | Right<A>;

export interface Task<E, A> {
  (): Promise<Either<E, A>>;
}

export const left = <E>(e: E): Either<E, never> => ({
  _tag: "Left",
  e,
});

export const right = <A>(a: A): Either<never, A> => ({
  _tag: "Right",
  a,
});

export const chain = <A, EA, B, EB>(f: (_: A) => Task<EB, B>) => (
  self: Task<EA, A>
): Task<EA | EB, B> => () =>
  self().then(
    (a): Promise<Either<EA | EB, B>> => {
      switch (a._tag) {
        case "Left": {
          return Promise.resolve(a);
        }
        case "Right": {
          return f(a.a)();
        }
      }
    }
  );

export const map = <A, B>(f: (_: A) => B) => <E>(
  self: Task<E, A>
): Task<E, B> => () =>
  self().then(
    (a): Promise<Either<E, B>> => {
      switch (a._tag) {
        case "Left": {
          return Promise.resolve(a);
        }
        case "Right": {
          return Promise.resolve({
            _tag: "Right",
            a: f(a.a),
          });
        }
      }
    }
  );

export const success = <A>(a: A): Task<never, A> => () =>
  Promise.resolve({
    _tag: "Right",
    a,
  });

export const fail = <E>(e: E): Task<E, never> => () =>
  Promise.resolve({
    _tag: "Left",
    e,
  });

export const fromPromise = <E>(onError: (u: unknown) => E) => <A>(
  p: () => Promise<A>
): Task<E, A> => () =>
  p()
    .then(
      (a): Either<E, A> => ({
        _tag: "Right",
        a,
      })
    )
    .catch((e) => Promise.resolve({ _tag: "Left", e: onError(e) }));

export const fromTryCatch = <E>(onError: (u: unknown) => E) => <A>(
  p: () => A
): Task<E, A> => {
  return () => {
    try {
      return success(p())();
    } catch (e) {
      return fail(onError(e))();
    }
  };
};

export const fromNonFailingPromise = <A>(
  p: () => Promise<A>
): Task<never, A> => () =>
  p().then(
    (a): Either<never, A> => ({
      _tag: "Right",
      a,
    })
  );

export const handle = <E = never, E1 = never, B = unknown>(
  f: (e: E) => Task<E1, B>
) => <A>(self: Task<E, A>): Task<E1, A | B> => () =>
  self().then(
    (r): Promise<Either<E1, A | B>> => {
      switch (r._tag) {
        case "Left": {
          return f(r.e)();
        }
        case "Right": {
          return Promise.resolve(r);
        }
      }
    }
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
    Promise.all(a.map((p) => p())).then(
      (res): Promise<Either<E, A[]>> => {
        const results = [] as A[];
        const errors = [] as E[];

        res.forEach((r) => {
          switch (r._tag) {
            case "Left": {
              errors.push(r.e);
              break;
            }
            case "Right": {
              results.push(r.a);
              break;
            }
          }
        });

        if (errors.length > 0) {
          return Promise.resolve({
            _tag: "Left",
            e: errors[0],
          });
        }

        return Promise.resolve({
          _tag: "Right",
          a: results,
        });
      }
    );
}

export const fold = <A, E, E1, A1, E2, A2>(
  f: (e: E) => Task<E1, A1>,
  g: (a: A) => Task<E2, A2>
) => (self: Task<E, A>): Task<E1 | E2, A1 | A2> => () =>
  self().then(
    (r): Promise<Either<E1 | E2, A1 | A2>> => {
      switch (r._tag) {
        case "Left": {
          return f(r.e)();
        }
        case "Right": {
          return g(r.a)();
        }
      }
    }
  );

export const result = <E, A>(task: Task<E, A>): Task<never, Either<E, A>> =>
  pipe(
    task,
    fold(
      (e) => success(left(e)),
      (a) => success(right(a))
    )
  );

export const of = success({});

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
  f: (cb: (res: Either<E, A>) => void) => void
): Task<E, A> => () =>
  new Promise<Either<E, A>>((res) => {
    f((result) => {
      res(result);
    });
  });

export const fromPromiseCallback = <E = never, A = unknown>(
  f: (resolve: (res: A) => void, reject: (error: E) => void) => void
): Task<E, A> => () =>
  new Promise<Either<E, A>>((res) => {
    f(
      (result) => {
        res(right(result));
      },
      (err) => {
        res(left(err));
      }
    );
  });
