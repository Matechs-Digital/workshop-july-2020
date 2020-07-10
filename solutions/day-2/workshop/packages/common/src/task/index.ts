import * as R from "./run";
import { Task } from "./task";

export {
  Task,
  all,
  chain,
  map,
  success,
  sequence,
  Either,
  Left,
  Right,
  fail,
  fromPromise,
  fromNonFailingPromise,
  fromTryCatch,
  handle,
  fold,
  left,
  right,
  bind,
  of,
  result,
} from "./task";

export const run = <E, A>(task: Task<E, A>) => R.run(task);

export const safeRun = <A>(task: Task<never, A>) =>
  R.run(task).then((a) =>
    a._tag === "Right" ? Promise.resolve(a.a) : Promise.reject(a.e)
  );

export const unsafeRun = <E, A>(task: Task<E, A>) =>
  R.run(task).then((a) =>
    a._tag === "Right" ? Promise.resolve(a.a) : Promise.reject(a.e)
  );
