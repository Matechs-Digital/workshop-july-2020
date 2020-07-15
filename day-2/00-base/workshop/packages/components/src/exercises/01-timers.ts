export const interval = (task: () => void, time: number) =>
  setInterval(() => {
    task();
  }, time);

export const timeout = (task: () => void, time: number) =>
  setTimeout(() => {
    task();
  }, time);
