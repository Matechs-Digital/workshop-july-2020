import * as fc from "fast-check";
import { arbitraryInteger, arbitraryFloat } from "./03-generative-testing";

describe("02-fast-check", () => {
  /**
   * Exercise 1 (3 mins)
   */
  it("arbitraryInteger is an integer", () => {
    fc.assert(
      fc.property(arbitraryInteger, (n) =>
        expect(Number.isInteger(n)).toBeTruthy()
      )
    );
  });

  /**
   * Exercise 2 (3 mins)
   */
  it("arbitraryFloat is finite", () => {
    fc.assert(
      fc.property(arbitraryFloat, (n) =>
        expect(Number.isFinite(n)).toBeTruthy()
      )
    );
  });

  /**
   * Exercise 3 (3 mins)
   */
  it.todo("arbitraryDouble is finite");

  /**
   * Exercise 4 (3 mins)
   */
  it.todo("arbitraryString is a string");

  /**
   * Exercise 5 (5 mins)
   */
  it.todo("arbitraryMinLengthString has a min length");

  /**
   * Exercise 6 (3 mins)
   */
  it.todo("arbitraryIntegerAsString is a string encoded integer");

  /**
   * Exercise 7 (3 mins)
   */
  it.todo("arbitraryPerson has a first and last name");

  /**
   * Exercise 8 (3 mins)
   */
  it.todo(
    "arbitraryPersonWithBirthDate has a first and last name and a birth date"
  );

  /**
   * Exercise 9 (5 mins)
   */
  it.todo("arbitraryOrganization has all the required fields");

  /**
   * Exercise 10 (3 mins)
   */
  it.todo(
    "arbitraryOrganizationsList generates lits of organizations correctly"
  );
});
