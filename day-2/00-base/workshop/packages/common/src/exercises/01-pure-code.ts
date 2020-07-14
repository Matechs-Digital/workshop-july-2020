import * as S from "./01-pure-code-sum";

/**
 * represent Person
 */
export interface Person {
  firstName: string;
  lastName: string;
}

/**
 * Creates a Person object
 */
export const makePerson = (p: Person): Person => ({
  firstName: p.firstName,
  lastName: p.lastName,
});

/**
 * Returns a Person object with the name changed
 */
export const changeFirstName = (firstName: string) => (p: Person): Person => ({
  ...p,
  firstName,
});

/**
 * Calculates base * n using the sum function
 */
export const multiplyByN = (n: number) => (base: number) => {
  const i = Math.floor(n);
  let m = 0;
  for (let k = 0; k < i; k += 1) {
    m = S.sum(m, base);
  }
  return m;
};

export const multiplyByN2 = (
  { sum }: { sum: typeof S.sum } = { sum: S.sum }
) => (n: number) => (base: number) => {
  const i = Math.floor(n);
  let m = 0;
  for (let k = 0; k < i; k += 1) {
    m = sum(m, base);
  }
  return m;
};
