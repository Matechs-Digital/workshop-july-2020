/**
 * A number -> number key-value store
 */
export interface KeyValueStore {
  put(k: number, v: number): void;

  get(k: number): number | undefined;
}

/**
 * Live instance of KeyValueStore
 */
export const keyValueStore = (): KeyValueStore => {
  const store = new Map<number, number>();

  return {
    get: (k) => store.get(k),
    put: (k, v) => {
      store.set(k, v);
    },
  };
};

/**
 * Puts (0, 1) (1, 2) (2, 3) in store and returns 3
 */
export const useKV = (kv: KeyValueStore) => {
  kv.put(0, 1);
  kv.put(1, 2);
  kv.put(2, 3);

  return kv.get(2);
};

/**
 * Uses useKV
 */
export const useMainKV = () => {
  const kv = keyValueStore();

  return useKV(kv);
};
