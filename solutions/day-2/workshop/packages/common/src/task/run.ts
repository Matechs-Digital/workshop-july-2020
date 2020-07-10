import { success, Rejection, InterruptiblePromise } from "./task";

export const runInterruptiblePromise = <E, A>(
  task: InterruptiblePromise<E, A>
) =>
  task
    .promise()
    .then((a) => success(a))
    .catch((e: Rejection<E>) => Promise.resolve(e));
