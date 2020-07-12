/**
 * Install `fast-check`, `yarn add -D -W fast-check` in the workspace root
 */

import * as fc from "fast-check";
import {
  Person,
  PersonWithBirthDate,
  Organization,
  Result,
  left,
  right,
} from "./01-data-validation";

/**
 * Generative testing is about automatic generation of data structures,
 * the `fast-check` library provides an implementation of a data type called `Arbitrary<A>`
 * to represent a generator of arbitrary values
 */

/**
 * Exercise 1
 */
export const arbitraryInteger: fc.Arbitrary<number> = fc.integer();

/**
 * Exercise 2
 */
export const arbitraryFloat: fc.Arbitrary<number> = fc.float();

/**
 * Exercise 3
 */
export const arbitraryDouble: fc.Arbitrary<number> = fc.double();

/**
 * Exercise 4
 */
export const arbitraryString: fc.Arbitrary<string> = fc.string();

/**
 * Exercise 5
 */
export const arbitraryMinLenghtString: (
  n: number,
  m?: number
) => fc.Arbitrary<string> = (n, m) => fc.string(n, m || n + 10);

/**
 * Exercise 6
 */
export const arbitraryIntegerAsString: fc.Arbitrary<string> = arbitraryInteger.map(
  (i) => `${i}`
);

/**
 * Exercise 7
 */
export const arbitraryPerson: fc.Arbitrary<Person> = arbitraryString.chain(
  (firstName) => arbitraryString.map((lastName) => ({ firstName, lastName }))
);

/**
 * Exercise 8
 */
export const arbitraryPersonWithBirthDate: fc.Arbitrary<PersonWithBirthDate> = arbitraryPerson.chain(
  (person) => fc.date().map((birthDate) => ({ ...person, birthDate }))
);

/**
 * Exercise 9
 */
export declare const arbitraryOrganization: fc.Arbitrary<Organization>;

/**
 * Exercise 10
 */
export const arbitraryResult: <A>(
  a: fc.Arbitrary<A>
) => fc.Arbitrary<Result<A>> = (a) =>
  fc.oneof(fc.array(fc.string()).map(left), a.map(right));
