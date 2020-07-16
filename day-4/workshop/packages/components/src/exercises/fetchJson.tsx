export async function fetchJson<A>(url: string) {
  const res = await fetch(url);
  return (await res.json()) as A;
}
