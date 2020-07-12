import {
  decodePerson,
  right,
  left,
  decodePersonWithBirthDate,
  decodeObjectWithPartials,
  decodeString,
} from "./01-data-validation";

describe("04-data-validation", () => {
  /**
   * Exercise 1
   */
  it("decodes a person", () => {
    const p = { firstName: "John", lastName: "doe" };

    const maybePerson = decodePerson(p);

    expect(maybePerson).toEqual(right(p));
  });

  /**
   * Exercise 2
   */
  it("fails to decode a person", () => {
    const p = { lastName: "doe" };

    const maybePerson = decodePerson(p);

    expect(maybePerson).toEqual(
      left(["cannot extract firstName from keys: [lastName]"])
    );
  });

  /**
   * Exercise 3
   */
  it("decodes a person with birth date", () => {
    const d = new Date();
    const p = {
      firstName: "John",
      lastName: "doe",
      birthDate: d.toISOString(),
    };

    const maybePerson = decodePersonWithBirthDate(p);

    expect(maybePerson).toEqual(
      right({
        ...p,
        birthDate: d,
      })
    );
  });

  /**
   * Exercise 4
   */
  it("decodes a person with birth failing for invalid date", () => {
    const p = {
      firstName: "John",
      birthDate: "bla",
    };

    const maybePerson = decodePersonWithBirthDate(p);

    expect(maybePerson).toEqual(
      left([
        "cannot extract lastName from keys: [firstName, birthDate]",
        "string bla cannot be parsed to a date",
      ])
    );
  });

  /**
   * Exercise 5
   */
  it("test decodeObjectWithPartials", () => {
    const withP = decodeObjectWithPartials({}, { nonRequired: decodeString });

    const result = withP({});
    const result2 = withP({ nonRequired: "ok" });
    const result3 = withP({ nonRequired: 1 });

    expect(result).toEqual(right({}));
    expect(result2).toEqual(right({ nonRequired: "ok" }));
    expect(result3).toEqual(left(["cannot read a string from: number"]));
  });
});
