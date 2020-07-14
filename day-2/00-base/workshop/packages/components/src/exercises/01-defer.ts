export const syncDefer = <A>(
  f: (runAfter: (body: () => void) => void) => A
) => {
  return () => {
    const deferrable = [] as (() => void)[];

    try {
      f((body) => {
        deferrable.push(body);
      });
    } finally {
      deferrable.forEach((d) => {
        d();
      });
    }
  };
};
