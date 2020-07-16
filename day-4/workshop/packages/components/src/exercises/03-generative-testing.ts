/**
 * Install `fast-check`, `yarn add -D -W fast-check` in the workspace root
 */

import * as fc from "fast-check";
import { Organization } from "./01-organizations";

/**
 * Generative testing is about automatic generation of data structures,
 * the `fast-check` library provides an implementation of a data type called `Arbitrary<A>`
 * to represent a generator of arbitrary values
 */

/**
 * Exercise 1 (3 min)
 */
export const arbitraryInteger: fc.Arbitrary<number> = fc.integer();

/**
 * Exercise 2 (3 min)
 */
export const arbitraryFloat: fc.Arbitrary<number> = fc.float();

/**
 * Exercise 3 (3 min)
 */
export declare const arbitraryDouble: fc.Arbitrary<number>;

/**
 * Exercise 4 (3 min)
 */
export declare const arbitraryString: fc.Arbitrary<string>;

/**
 * Exercise 5 (3 min),
 * use a default maximim of n + 10
 */
export declare const arbitraryMinLengthString: (
  n: number,
  m?: number
) => fc.Arbitrary<string>;

/**
 * Exercise 6 (3 min)
 */
export declare const arbitraryIntegerAsString: fc.Arbitrary<string>;

/**
 * Exercise 7 (5 min)
 */
export interface Person {
  firstName: string;
  lastName: string;
}

export const arbitraryPerson: fc.Arbitrary<Person> = fc
  .string()
  .chain((firstName) =>
    fc.string().map((lastName): Person => ({ firstName, lastName }))
  );

/**
 * Exercise 8 (3 min)
 */
export interface PersonWithBirthDate extends Person {
  birthDate: Date;
}

export declare const arbitraryPersonWithBirthDate: fc.Arbitrary<PersonWithBirthDate>;

/**
 * Exercise 9 (5 min)
 */
export declare const arbitraryOrganization: fc.Arbitrary<Organization>;

/**
 * Exercise 10 (3 mins)
 */
export declare const arbitraryOrganizationList: (
  minLength: number,
  maxLength: number
) => fc.Arbitrary<Organization[]>;
