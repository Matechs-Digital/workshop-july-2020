/**
 * At the end of day-3 when we started integration testing we made an example of
 * fetching data from the github API.
 *
 * In that test we skipped one very important part, our tests are valid as much as
 * the data that is consumed at the edge of our system.
 *
 * In that example we trusted the github api to return a certain format and we
 * almost ignored the error case, in a production setup that side of the code will
 * lead to runtime exceptions in the moment anything changes.
 *
 * No matter what measures we take at the type level to ensure correctness, it will
 * be invalidated in the moment an api returns something differently.
 *
 * Data validation is about making sure the edges are properly validated so that in our
 * code we can assume type correctness.
 *
 * Proper data validation can be described by the sentence: "Parse, don't validate",
 *
 * for validation we intend a pure boolean checking for example is 1 === 1, or is unknown === string
 *
 * for parsing we mean "are we able to read a string from this 'unknown' ?
 * in case we do, what's the string? in case we don't what's the error?"
 */

import { pipe } from "@workshop/common/previous/01-pipe";

/**
 * Let's model a decoder for our data, we will encode the errors as a string[]
 */

export type Result<A> = Either<string[], A>;

export interface Decoder<A> {
  (u: unknown): Result<A>;
}

export type Either<E, A> = Left<E> | Right<A>;

export interface Left<E> {
  _tag: "Left";
  left: E;
}

export interface Right<A> {
  _tag: "Right";
  right: A;
}

/**
 * Exercise 1
 */
export const left = <E>(e: E): Either<E, never> => ({
  _tag: "Left",
  left: e,
});

/**
 * Exercise 2
 */
export const right = <A>(a: A): Either<never, A> => ({
  _tag: "Right",
  right: a,
});

/**
 * Exercise 3
 */
export const chain = <A, B>(f: (a: A) => Result<B>) => (
  self: Decoder<A>
): Decoder<B> => (u) =>
  pipe(self(u), (e) => {
    switch (e._tag) {
      case "Left": {
        return e;
      }
      case "Right": {
        return f(e.right);
      }
    }
  });

/**
 * Exercise 4
 */
export const map = <A, B>(f: (a: A) => B) => (self: Decoder<A>): Decoder<B> => (
  u
) =>
  pipe(self(u), (e) => {
    switch (e._tag) {
      case "Left": {
        return e;
      }
      case "Right": {
        return right(f(e.right));
      }
    }
  });

/**
 * Exercise 5
 */
export const decodeString: Decoder<string> = (u) =>
  typeof u === "string"
    ? right(u)
    : left([`cannot read a string from: ${typeof u}`]);

/**
 * Exercise 6
 */
export const decodeDate = pipe(
  decodeString,
  chain((s) => {
    const dateErrorMessage = (s: string): string =>
      `string ${s} cannot be parsed to a date`;

    try {
      const parsed = Date.parse(s);

      if (!Number.isNaN(parsed)) {
        return right(new Date(parsed));
      } else {
        return left([dateErrorMessage(s)]);
      }
    } catch (e) {
      return left([
        dateErrorMessage(s),
        ...(e instanceof Error ? [e.message] : []),
      ]);
    }
  })
);

/**
 * Exercise 7: Hard
 */
export function decodeObject<O extends Record<string, Decoder<any>>>(
  o: O
): Decoder<{ [k in keyof O]: [O[k]] extends [Decoder<infer K>] ? K : never }> {
  return (u: unknown) => {
    if (typeof u !== "object") {
      return left([`cannot parse an object from ${typeof u}`]);
    }

    if (u == null) {
      return left([`cannot parse an object from: null`]);
    }

    const i = u as { [k: string]: unknown | undefined };

    const result = {} as {
      [k in keyof O]: [O[k]] extends [Decoder<infer K>] ? K : never;
    };

    const errors = [] as string[];

    Object.keys(o).forEach((k: keyof O & string) => {
      const d = o[k];

      if (i[k]) {
        const r = d(i[k]);

        if (r._tag === "Left") {
          errors.push(...r.left);
        } else {
          result[k] = r.right;
        }
      } else {
        errors.push(
          `cannot extract ${k} from keys: [${Object.keys(i).join(", ")}]`
        );
      }
    });

    if (errors.length > 0) {
      return left(errors);
    }

    return right(result);
  };
}

/**
 * Model for a person
 */
export interface Person {
  firstName: string;
  lastName: string;
}

export interface PersonWithBirthDate extends Person {
  birthDate: Date;
}

/**
 * Exercise 8
 */
export const decodePerson: Decoder<Person> = decodeObject({
  firstName: decodeString,
  lastName: decodeString,
});

/**
 * Exercise 9
 */
export const decodePersonWithBirthDate: Decoder<PersonWithBirthDate> = decodeObject(
  {
    firstName: decodeString,
    lastName: decodeString,
    birthDate: decodeDate,
  }
);

/**
 * Write a model for Organization
 */

export interface Organization {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_urs: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url?: string;
  description?: string;
}

/**
 * Needs partial values...
 */

/**
 * Exercise 8: Hard
 */
export function decodeObjectWithPartials<
  O extends Record<string, Decoder<any>>,
  P extends Record<string, Decoder<any>>
>(
  o: O,
  p: P
): Decoder<
  { [k in keyof O]: [O[k]] extends [Decoder<infer K>] ? K : never } &
    { [k in keyof O]?: [O[k]] extends [Decoder<infer K>] ? K : never }
> {
  return (u: unknown) => {
    if (typeof u !== "object") {
      return left([`cannot parse an object from ${typeof u}`]);
    }

    if (u == null) {
      return left([`cannot parse an object from: null`]);
    }

    const i = u as { [k: string]: unknown | undefined };

    const result = {} as {
      [k in keyof O]: [O[k]] extends [Decoder<infer K>] ? K : never;
    } &
      { [k in keyof O]?: [O[k]] extends [Decoder<infer K>] ? K : never };

    const errors = [] as string[];

    Object.keys(o).forEach((k: keyof O & string) => {
      const d = o[k];

      if (i[k]) {
        const r = d(i[k]);

        if (r._tag === "Left") {
          errors.push(...r.left);
        } else {
          result[k] = r.right;
        }
      } else {
        errors.push(
          `cannot extract ${k} from keys: [${Object.keys(i).join(", ")}]`
        );
      }
    });

    Object.keys(p).forEach((k: keyof P & string) => {
      const d = p[k];

      if (i[k]) {
        const r = d(i[k]);

        if (r._tag === "Left") {
          errors.push(...r.left);
        } else {
          result[k] = r.right;
        }
      }
    });

    if (errors.length > 0) {
      return left(errors);
    }

    return right(result);
  };
}

/**
 * Exercise 9
 */

// const decode Organization = ???
