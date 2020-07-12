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

export declare const left: <E>(e: E) => Either<E, never>;

/**
 * Exercise 2
 */

export declare const right: <A>(a: A) => Either<never, A>;

/**
 * Exercise 3
 */

export declare const chain: <A, B>(
  f: (a: A) => Result<B>
) => (self: Decoder<A>) => Decoder<B>;

/**
 * Exercise 4
 */

export declare const map: <A, B>(
  f: (a: A) => B
) => (self: Decoder<A>) => Decoder<B>;

/**
 * Exercise 5
 */

export declare const decodeString: Decoder<string>;

/**
 * Exercise 6
 */

export declare const decodeDate: Decoder<Date>;

/**
 * Exercise 7: Hard
 */

export declare function decodeObject<O extends Record<string, Decoder<any>>>(
  o: O
): Decoder<{ [k in keyof O]: [O[k]] extends [Decoder<infer K>] ? K : never }>;

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

export declare const decodePerson: Decoder<Person>;

/**
 * Exercise 9
 */
export declare const decodePersonWithBirthDate: Decoder<PersonWithBirthDate>;

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

export declare function decodeObjectWithPartials<
  O extends Record<string, Decoder<any>>,
  P extends Record<string, Decoder<any>>
>(
  o: O,
  p: P
): Decoder<
  { [k in keyof O]: [O[k]] extends [Decoder<infer K>] ? K : never } &
    { [k in keyof O]?: [O[k]] extends [Decoder<infer K>] ? K : never }
>;

/**
 * Exercise 9
 */

export declare const decodeOrganization: Decoder<Organization>;

/**
 * We have so far built a nice Decoder that allows generic decoding while preserving all the errors,
 * there is only one problem, we are defining things twice:
 * 1) we make an interface or a type representing the value we want to make a decoder of
 * 2) we make a decoder of a generic structure that implements the interface
 *
 * We would like to derive the types of 1 and only write 2
 */

export type TypeOf<D extends Decoder<any>> = [D] extends [Decoder<infer A>]
  ? A
  : never;

/**
 * Example
 */

export declare const decodeNumber: Decoder<number>;

export declare const walletDecoder: Decoder<{ id: string; balance: number }>;

export interface Wallet extends TypeOf<typeof walletDecoder> {}

/**
 * Nice, only another problem left,
 * walletDecoder has type Decoder<{ id: string; balance: number; }>
 *
 * we would like it to be: Decoder<Wallet>
 */

/**
 * Trick
 */
export const as = <T>() => (k: Decoder<T>): Decoder<T> => k;

const User_ = decodeObject({
  id: decodeString,
  email: decodeString,
});

export interface User extends TypeOf<typeof User_> {}

export const UserDecoder = as<User>()(User_);
