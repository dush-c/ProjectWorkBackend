import { genericHandler } from "./generic";
import { notFoundHandler } from "./not-found";
import { notFoundUserHandler } from "./not-found-user";
import { validationErrorHandler } from "./validation";

export const errorHandlers = [
  notFoundHandler,
  validationErrorHandler,
  genericHandler,
  notFoundUserHandler,
];
