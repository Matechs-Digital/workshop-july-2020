import * as code from "./01-pure-code";

/**
 * Calculates base * n using the sum function
 */
export const multiplyByN = (n: number) => (base: number) => {
  const i = Math.floor(n);
  let m = 0;
  for (let k = 0; k < i; k += 1) {
    m = code.sum(m, base);
  }
  return m;
};
