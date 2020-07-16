import "isomorphic-fetch";

export async function fetchJson<T>(url: string) {
  const res = await fetch(url);
  return (await res.json()) as T;
}
