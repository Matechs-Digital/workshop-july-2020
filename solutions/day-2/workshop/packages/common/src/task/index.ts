import * as R from "./run";
import { Task, Exit } from "./task";

export {
  Task,
  all,
  chain,
  map,
  succeed,
  sequence,
  Exit,
  Success,
  fail,
  fromPromise,
  fromNonFailingPromise,
  fromTryCatch,
  handle,
  fold,
  success,
  bind,
  of,
  result,
  Failure,
  Interrupt,
  Rejection,
  failure,
  fromCallback,
  interrupt,
  tap,
  sync,
  InterruptiblePromise,
  foreach,
} from "./task";

export const run = <E, A>(task: Task<E, A>): Promise<Exit<E, A>> =>
  R.runInterruptiblePromise(task());

export const runAsync = <E, A>(task: Task<E, A>) => (
  cb?: (e: Exit<E, A>) => void
) => {
  const interruptible = task();
  const running = R.runInterruptiblePromise(interruptible);

  running.then((e) => {
    cb?.(e);
  });

  return () => {
    interruptible.interrupt();
  };
};
