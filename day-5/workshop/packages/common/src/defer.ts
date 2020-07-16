export const deferAsync = <A>(
  f: (runAfter: (g: () => Promise<any>) => void) => Promise<A>
) => async () => {
  const runAfterRegistry = [] as (() => Promise<any>)[];

  try {
    const res = await f((g) => {
      runAfterRegistry.push(g);
    });
    return res;
  } finally {
    await Promise.all(runAfterRegistry.map((g) => g()));
  }
};

export const defer = <A>(f: (runAfter: (g: () => any) => void) => A) => () => {
  const runAfterRegistry = [] as (() => any)[];

  try {
    const res = f((g) => {
      runAfterRegistry.push(g);
    });
    return res;
  } finally {
    runAfterRegistry.forEach((g) => g());
  }
};
