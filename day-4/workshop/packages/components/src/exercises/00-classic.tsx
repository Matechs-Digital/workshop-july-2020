import * as React from "react";

interface UseValuesDb {
  set: (v: string) => Promise<void>;
  all: string[];
  first: () => string | undefined;
  size: () => number;
  loading: () => boolean;
}

export const useValuesDb = (): UseValuesDb => {
  const [all, setAll] = React.useState<string[]>([]);
  const [pending, setLoading] = React.useState<boolean[]>([]);

  const set = async (v: string) => {
    setLoading((l) => [...l, true]);
    await new Promise((r) => {
      setTimeout(() => {
        r();
      }, 1500);
    });
    setAll((a) => (a.includes(v) ? a : [...a, v]));
    setLoading((l) => {
      const nl = [...l];
      nl.shift();
      return nl;
    });
  };

  const size = () => all.length;
  const loading = () => pending.length > 0;

  const first = (): string | undefined => all[0];

  return {
    set,
    all,
    first,
    size,
    loading,
  };
};

export interface UseValuesDbContext {
  readonly useValuesDb: () => UseValuesDb;
}

export const useValuesDbContext = React.createContext<UseValuesDbContext>({
  useValuesDb,
});

export const View = () => {
  const { useValuesDb } = React.useContext(useValuesDbContext);
  const { all, set, first, size, loading } = useValuesDb();

  const textInput = React.useRef<HTMLInputElement>(null);

  if (loading()) {
    return <div>Loading</div>;
  }

  return (
    <>
      {size() > 0 ? (
        <div data-testid={`view-first`}>First: {first()}</div>
      ) : null}
      <div>
        {all.map((s, i) => (
          <div key={s} data-testid={`view-item-${i}`}>
            {s}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          if (textInput.current && textInput.current.value.length > 0) {
            set(textInput.current.value);
          }
          e.preventDefault();
        }}
      >
        <label htmlFor={"key"}>Key:</label>
        <input
          ref={textInput}
          data-testid="view-input"
          type={"text"}
          name={"key"}
        />
        <button type={"submit"}>Add</button>
      </form>
    </>
  );
};
