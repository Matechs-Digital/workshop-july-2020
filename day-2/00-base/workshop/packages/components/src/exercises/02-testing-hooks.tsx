import * as React from "react";

export const useCounter = () => {
  const [count, setCount] = React.useState(0);

  const increment = () => {
    setCount((c) => c + 1);
  };

  return {
    count,
    increment,
  };
};

export const useAsyncCounter = (delay = 5000) => {
  const [count, setCount] = React.useState(0);

  const increment = () => {
    setTimeout(() => {
      setCount((c) => c + 1);
    }, delay);
  };

  return {
    count,
    increment,
  };
};

export const useAsyncAutoIncrement = (delay = 100, every = 5000) => {
  const [count, setCount] = React.useState(0);

  const increment = () => {
    setTimeout(() => {
      setCount((c) => c + 1);
    }, delay);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      increment();
    }, every);

    return () => {
      clearInterval(interval);
    };
  });

  return {
    count,
  };
};
