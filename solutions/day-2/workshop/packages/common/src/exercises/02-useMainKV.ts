import * as KV from "./02-mocking";

/**
 * Uses useKV
 */
export const useMainKV = () => {
  const kv = KV.keyValueStore();

  return KV.useKV(kv);
};
