import { makePerson, Person, multiplyByN, multiplyByN2 } from "./01-pure-code";
import { sum } from "./01-pure-code-sum";
import * as S from "./01-pure-code-sum";

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
  it("asserts makePerson create a person via structural equality", () => {
    const person: Person = { firstName: "john", lastName: "doe" };
    expect(makePerson(person)).toMatchObject<Omit<Person, "lastName">>({
      firstName: "john",
    });
  });

  /**
   * Exercise 12
   */
  it("asserts multiplyByN(2)(5) === 10", () => {
    expect(multiplyByN(2)(5)).toBe(10);
  });

  /**
   * Exercise 13
   */
  it("asserts that multiplyByN(2)(5) calls sum exactly 2 times", () => {
    const s = jest.spyOn(S, "sum");
    const f = jest.fn();

    s.mockImplementation((x, y) => {
      f(x, y);
      return 0;
    });

    multiplyByN(2)(5);

    expect(s).toHaveBeenCalledTimes(2);
    expect(f).toHaveBeenNthCalledWith(1, 0, 5);
    expect(f).toHaveBeenNthCalledWith(2, 0, 5);
  });

  /**
   * Exercise 14
   */
  it.todo("make sure any mock taken in the previous test is cleared");

  /**
   * Exercise 15
   * Refactor the code of multiplyByN using the dependency injection pattern.
   */
  it("asserts that multiplyByN(2)(5) calls sum exactly 2 times using DI", () => {
    const f = jest.fn();
    const sum = (x: number, y: number) => {
      const r = S.sum(x, y);
      f(x, y, r);
      return r;
    };
    multiplyByN2({ sum })(2)(5);
    expect(f).toHaveBeenCalledTimes(2);
    expect(f).toHaveBeenNthCalledWith(1, 0, 5, 5);
    expect(f).toHaveBeenNthCalledWith(2, 5, 5, 10);
  });
});
