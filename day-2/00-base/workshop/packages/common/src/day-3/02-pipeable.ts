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

export class KeyValueStoreP<K, V> {
  constructor(readonly kv = new Map<K, V>()) {}

  copyKV() {
    return new Map(this.kv);
  }
}

export const empty = <K, V>() => new KeyValueStoreP<K, V>();

export const add = <K, V>(k: K, v: V) => (kv: KeyValueStoreP<K, V>) => {
  const newKV = kv.copyKV();

  newKV.set(k, v);

  return new KeyValueStoreP(newKV);
};

export const get = <K>(k: K) => <V>(kv: KeyValueStoreP<K, V>) => {
  return kv.kv.get(k);
};

export const stringKeys = <K extends string, V>(
  kv: KeyValueStoreP<K, V>
): string[] => {
  return Array.from(kv.kv.keys());
};

/**
 * Usage
 */
export const finalP = pipe(
  empty<string, string>(),
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
