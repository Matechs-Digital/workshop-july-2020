/**
 * calculates x + y
 */
export const sum = (x: number, y: number): number => x + y;

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
export const makePerson = (p: Person): Person => p;

/**
 * Returns a Person object with the name changed
 */
export const changeFirstName = (firstName: string) => (p: Person): Person => ({
  ...p,
  firstName,
});
