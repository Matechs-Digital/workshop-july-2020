import * as React from "react";

export const useValuesDb = () => {
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

  const first = () => all[0];

  return {
    set,
    all,
    first,
    size,
    loading,
  };
};

export const View = () => {
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
