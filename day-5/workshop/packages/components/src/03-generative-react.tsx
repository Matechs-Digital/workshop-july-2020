import * as React from "react";

export const RemConverter: React.FC<{}> = () => {
  const [baseFontSize] = React.useState(16);
  const [px, setPx] = React.useState(baseFontSize);
  const [rem, setRem] = React.useState(px2Rem(px, baseFontSize));

  const convert = (e: React.FormEvent) => {
    e.preventDefault();
    setRem(px2Rem(px, baseFontSize));
  };

  return (
    <div>
      <form onSubmit={convert}>
        <h6>Base font-size: {baseFontSize}</h6>

        <div>
          <label>PX</label>
          <input
            data-testid="px"
            value={px}
            onChange={(e) => setPx(parseInt(e.target.value, 10))}
          />
        </div>

        <div>
          <label>REM</label>
          <input data-testid="rem" value={rem} disabled />
        </div>

        <button type="submit">Convert</button>
      </form>
    </div>
  );
};

export function px2Rem(px: number, baseFontSize: number) {
  return px / baseFontSize;
}
