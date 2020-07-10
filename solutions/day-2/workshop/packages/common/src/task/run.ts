import { Task, Either } from "./task";

export const run = <E, A>(task: Task<E, A>): Promise<Either<E, A>> => task();
