import * as code from "./01-pure-code";
import { sum, makePerson } from "./01-pure-code";
import { multiplyByN } from "./01-multiplyByN";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("01-pure-code", () => {
  /**
   * Exercise 1
   */
  it("asserts sum(3, 2) === 5", () => {
    expect(sum(3, 2)).toBe(5);
  });

  /**
   * Exercise 2
   */
  it("asserts sum(3, 2) > 4", () => {
    expect(sum(3, 2)).toBeGreaterThan(4);
  });

  /**
   * Exercise 3
   */
  it("asserts sum(3, 2) >= 5", () => {
    expect(sum(3, 2)).toBeGreaterThanOrEqual(5);
  });

  /**
   * Exercise 4
   */
  it("asserts sum(3, 2) to be defined", () => {
    expect(sum(3, 2)).toBeDefined();
  });

  /**
   * Exercise 5
   */
  it("asserts sum(3, 2) === 4 to be false", () => {
    expect(sum(3, 2) === 4).toBeFalsy();
  });

  /**
   * Exercise 6
   */
  it("asserts sum(3, 2) === 5 to be true", () => {
    expect(sum(3, 2) === 5).toBeTruthy();
  });

  /**
   * Exercise 7
   */
  it("asserts sum(3, 2) < 6 to be true", () => {
    expect(sum(3, 2)).toBeLessThan(6);
  });

  /**
   * Exercise 8
   */
  it("asserts sum(3, 2) to not be NaN", () => {
    expect(sum(3, 2)).not.toBeNaN();
  });

  /**
   * Exercise 9
   */
  it("asserts sum(3, 2) to not be null", () => {
    expect(sum(3, 2)).not.toBeNull();
  });

  /**
   * Exercise 10
   */
  it("asserts sum(3, 2) to not be undefined", () => {
    expect(sum(3, 2)).not.toBeUndefined();
  });

  /**
   * Exercise 11
   */
  it("asserts sum(3, 2) to not be undefined", () => {
    expect(sum(3, 2)).not.toBeUndefined();
  });

  /**
   * Exercise 12
   */
  it("asserts makePerson create a person via structural equality", () => {
    expect(
      makePerson({
        firstName: "Michael",
        lastName: "Arnaldi",
      })
    ).toEqual({ firstName: "Michael", lastName: "Arnaldi" });
  });

  /**
   * Exercise 13
   */
  it("asserts multiplyByN(2)(5) === 10", () => {
    expect(multiplyByN(2)(5)).toBe(10);
  });

  const callTracker = jest.fn();

  /**
   * Exercise 14
   */
  it("asserts that multiplyByN(2)(5) calls sum exactly 2 times", () => {
    const sum = code.sum;
    const spy = jest.spyOn(code, "sum");
    spy.mockImplementation((x, y) => {
      callTracker();
      return sum(x, y);
    });
    expect(multiplyByN(2)(5)).toBe(10);
    expect(callTracker).toHaveBeenCalledTimes(2);
  });

  /**
   * Exercise 15
   */
  it("make sure any mock taken in the previous test is cleared", () => {
    expect(multiplyByN(2)(5)).toBe(10);
    expect(callTracker).toHaveBeenCalledTimes(2);
  });

  /**
   * Exercise 16
   * Refactor the code of multiplyByN using the dependency injection pattern.
   */
  it.todo("asserts that multiplyByN(2)(5) calls sum exactly 2 times using DI");
});
