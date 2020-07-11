import { pipe } from "./01-pipe";

/**
 * Fluent vs Pipeable
 */

/**
 * The Fluent Approach
 */

export class KeyValueStore {
  constructor(private kv = new Map<string, string>()) {}

  copyKV() {
    return new Map(this.kv);
  }

  add(k: string, v: string) {
    const newKV = this.copyKV();

    newKV.set(k, v);

    return new KeyValueStore(newKV);
  }

  get(k: string) {
    return this.kv.get(k);
  }
}

/**
 * Usage
 */

export const final = new KeyValueStore()
  .add("0", "0")
  .add("1", "1")
  .add("2", "2")
  .get("0");

/**
 * Problems:
 * - the type of the "pipe" is fixed
 * - all methods must be in the class
 * - has limitations on generic types due to how the variance is handled in typescript
 * - very bad for tree shaking
 */

/**
 * The Pipeable Approach
 */

export class KeyValueStoreP {
  constructor(readonly kv = new Map<string, string>()) {}

  copyKV() {
    return new Map(this.kv);
  }
}

export const empty = () => new KeyValueStoreP();

export const add = (k: string, v: string) => (kv: KeyValueStoreP) => {
  const newKV = kv.copyKV();

  newKV.set(k, v);

  return new KeyValueStoreP(newKV);
};

export const get = (k: string) => (kv: KeyValueStoreP) => {
  return kv.kv.get(k);
};

/**
 * Usage
 */

export const finalP = pipe(
  empty(),
  add("0", "0"),
  add("1", "1"),
  add("2", "2"),
  get("0")
);

/**
 * Style:
 * - always data-last,
 * - type of the computation can change during the same pipe
 * - works well with type inference if used in a pipe
 * - allows complete freedom on generics
 */
