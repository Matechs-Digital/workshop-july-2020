import * as fc from "fast-check";
import {
  arbitraryInteger,
  arbitraryFloat,
  arbitraryString,
  arbitraryMinLenghtString,
  arbitraryIntegerAsString,
  arbitraryPerson,
  arbitraryPersonWithBirthDate,
  arbitraryResult,
} from "./02-generative-testing";
import { defer } from "../previous/04-defer";

describe("02-fast-check", () => {
  /**
   * Exercise 1
   */
  it("arbitraryInteger is an integer", () =>
    fc.assert(
      fc.property(arbitraryInteger, (n) => {
        expect(Number.isInteger(n)).toBe(true);
      })
    ));

  /**
   * Exercise 2
   */
  it("arbitraryFloat is finite", () =>
    fc.assert(
      fc.property(arbitraryFloat, (n) => {
        expect(Number.isFinite(n)).toBe(true);
      })
    ));

  /**
   * Exercise 3
   */
  it("arbitraryDouble is finite", () =>
    fc.assert(
      fc.property(arbitraryFloat, (n) => {
        expect(Number.isFinite(n)).toBe(true);
      })
    ));

  /**
   * Exercise 4
   */
  it("arbitraryString is a string", () =>
    fc.assert(
      fc.property(arbitraryString, (s) => {
        expect(typeof s === "string").toBe(true);
      })
    ));

  /**
   * Exercise 5
   */
  it("arbitraryMinLenghtString is a has a min length", () =>
    fc.assert(
      fc.property(
        fc
          .integer(0, 10)
          .chain((l) => arbitraryMinLenghtString(l).map((s) => ({ s, l }))),
        ({ l, s }) => {
          expect(typeof s === "string" && s.length).toBeGreaterThanOrEqual(l);
        }
      )
    ));

  /**
   * Exercise 6
   */
  it("arbitraryIntegerAsString is a string encoded integer", () =>
    fc.assert(
      fc.property(arbitraryIntegerAsString, (i) => {
        expect(typeof i === "string" && parseInt(i)).not.toBeNaN();
      })
    ));

  /**
   * Exercise 7
   */
  it("arbitraryPerson has a first and last name", () =>
    fc.assert(
      fc.property(arbitraryPerson, (p) => {
        expect(typeof p.firstName).toBe("string");
        expect(typeof p.lastName).toBe("string");
      })
    ));

  /**
   * Exercise 8
   */
  it("arbitraryPersonWithBirthDate has a first and last name and a birth date", () =>
    fc.assert(
      fc.property(arbitraryPersonWithBirthDate, (p) => {
        expect(typeof p.firstName).toBe("string");
        expect(typeof p.lastName).toBe("string");
        expect(p.birthDate instanceof Date).toBe(true);
      })
    ));

  /**
   * Exercise 9
   */
  it.todo("arbitraryOrganization has all the required fields");

  /**
   * Exercise 10
   */
  it(
    "arbitraryResult is left or right",
    defer((after) => {
      const f = jest.fn();
      const g = jest.fn();

      after(() => {
        expect(f).toHaveBeenCalled();
        expect(g).toHaveBeenCalled();
      });

      return fc.assert(
        fc.property(arbitraryResult(arbitraryMinLenghtString(1)), (s) => {
          switch (s._tag) {
            case "Left": {
              f();
              expect(Array.isArray(s.left)).toBe(true);
              break;
            }
            case "Right": {
              g();
              expect(s.right.length).toBeGreaterThan(0);
              break;
            }
          }
        })
      );
    })
  );
});
