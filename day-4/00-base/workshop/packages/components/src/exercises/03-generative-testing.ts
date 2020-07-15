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
export declare const arbitraryInteger: fc.Arbitrary<number>;

/**
 * Exercise 2 (3 min)
 */
export declare const arbitraryFloat: fc.Arbitrary<number>;

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
export declare const arbitraryMinLenghtString: (
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

export declare const arbitraryPerson: fc.Arbitrary<Person>;

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
