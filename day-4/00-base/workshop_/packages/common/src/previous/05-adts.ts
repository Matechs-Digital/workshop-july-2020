/**
 * ADTs are data stucture that represent logical OR types,
 * for example in the 03-better-promise we represented the exit state
 * of a computation as `type Exit<E, A> = Success<A> | Rejection<E>`
 *
 * In TypeScript ADTs are encoded using `tagged union types` where tagged means the
 * union is discriminated a "_tag" field, the "_tag" field should be a literal type
 * either a number literal or a string listeral or a symbol literal.
 *
 * Note that the name of "_tag" could be different it's important to stick with one.
 */

import { pipe } from "./01-pipe";

/**
 * Exercise 1,
 *
 * construct `type RequestStatus = New | Loading | Errored | Done` where all types are
 * known (no generics involved) and only `type` constructors are used (no interface)
 */

export type RequestStatus =
  | { _tag: "New" }
  | { _tag: "Loading" }
  | { _tag: "Errored"; message: string }
  | { _tag: "Done"; result: string };

/**
 * Exercise 2,
 *
 * construct `type ARequestStatus<A> = New | Loading | Errored | Done<A>` where A is the
 * result type
 */

export type ARequestStatus<A> =
  | { _tag: "New" }
  | { _tag: "Loading" }
  | { _tag: "Errored"; message: string }
  | { _tag: "Done"; result: A };

/**
 * Exercise 3,
 *
 * write a function `step` that tahes the current request status and returns:
 * 0 for new
 * 1 for loading
 * 2 for errored
 * 3 for done
 */

export function step<A>(a: ARequestStatus<A>): 0 | 1 | 2 | 3 {
  switch (a._tag) {
    case "New": {
      return 0;
    }
    case "Loading": {
      return 1;
    }
    case "Errored": {
      return 2;
    }
    case "Done": {
      return 3;
    }
  }
}

/**
 * Exercise 4,
 *
 * write a `type ExtractA<T extends ARequestStatus<any>>` that when called extract the value A of ARequestStatus<A>
 */

// export type N = ARequestStatus<number>;
// export type AofN = ExtractA<N>;

export type N = ARequestStatus<number>;
export type AofN = ExtractA<N>;

export type ExtractA<T extends ARequestStatus<any>> = [T] extends [
  ARequestStatus<infer A>
]
  ? A
  : never;

/**
 * Exercise 5,
 *
 * improve the types by using interfaces to represent each case so the type appears as:
 *
 * type BRequestStatus<A> = New | Loading | Errored | Done
 */
export interface New {
  _tag: "New";
}

export interface Loading {
  _tag: "Loading";
}

export interface Errored {
  _tag: "Errored";
  message: string;
}

export interface Done<A> {
  _tag: "Done";
  result: A;
}

export type BRequestStatus<A> = New | Loading | Errored | Done<A>;

/**
 * Exercise 6,
 *
 * introduce a type to represent the payload of Errored
 *
 * type CRequestStatus<A, E> = CNew | CLoading | CErrored<E> | CDone
 */
interface CNew {
  _tag: "New";
}

interface CLoading {
  _tag: "Loading";
}

interface CErrored<E> {
  _tag: "Errored";
  payload: E;
}

interface CDone<A> {
  _tag: "Done";
  result: A;
}

type CRequestStatus<E, A> = CNew | CLoading | CErrored<E> | CDone<A>;

/**
 * Exercise 7:
 * function orElse<E, E1, A>(req: CRequestStatus<E, A>, f: (_: E) => CRequestStatus<E1, A>): CRequestStatus<E1, A>
 */
function orElse<E, E1, A>(
  req: CRequestStatus<E, A>,
  f: (_: E) => CRequestStatus<E1, A>
): CRequestStatus<E1, A> {
  if (req._tag === "Errored") {
    return f(req.payload);
  } else {
    return req;
  }
}

/**
 * Exercise 8
 * create `function errored<E>(e: E): CRequestStatus<E, never>`
 */
function errored<E>(e: E): CRequestStatus<E, never> {
  return {
    _tag: "Errored",
    payload: e,
  };
}

/**
 * Exercise 9
 * create `function done<A>(a: A): CRequestStatus<never, A>`
 */
function done<A>(a: A): CRequestStatus<never, A> {
  return {
    _tag: "Done",
    result: a,
  };
}

/**
 * Exercise 10
 * Given ErrA, ErrB, ErrC & `cstatus: CRequestStatus<ErrA | ErrB | ErrC, number>`
 *
 * Using orElse wite a function handleErrA that handle the case
 * status === ErrA returning 1 otherwise return the error
 */
class ErrA {
  readonly _tag = "ErrA";
}

class ErrB {
  readonly _tag = "ErrA";
}

class ErrC {
  readonly _tag = "ErrA";
}

declare const cstatus: CRequestStatus<ErrA | ErrB | ErrC, number>;

const x = orElse(cstatus, (e) => {
  switch (e._tag) {
    case "ErrA": {
      return done(1);
    }
    default: {
      return errored(e);
    }
  }
});

/**
 * Exercise 10
 *
 * write a function `map: <A, B>(f: (a: A) => B) => <E>(requestStatus: CRequestStatus<E, A>) => CRequestStatus<E, B>`
 */
const map: <A, B>(
  f: (a: A) => B
) => <E>(requestStatus: CRequestStatus<E, A>) => CRequestStatus<E, B> = (f) => (
  s
) => {
  switch (s._tag) {
    case "Done": {
      return done(f(s.result));
    }
    default: {
      return s;
    }
  }
};

/**
 * Exercise 11
 *
 * use the function map to increment the value of statusNumber 3 times
 */

// const statusNumber = done(10)
// const nextStatusNumber = ???

const statusNumber = done(10);

const nextStatusNumber = pipe(
  statusNumber,
  map((n) => n + 1),
  map((n) => n + 1),
  map((n) => n + 1)
);

/**
 * Exercise 12:
 * make nextStatusNumber generic for any CRequestStatus<E, number>
 *
 * const nextNumber = ???
 */
const nextNumber = <E>(_: CRequestStatus<E, number>) =>
  pipe(
    _,
    map((n) => n + 1),
    map((n) => n + 1),
    map((n) => n + 1)
  );
