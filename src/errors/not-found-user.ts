import { Request, Response, NextFunction } from "express";

export class NotFoundUserError extends Error {
  constructor() {
    super("User does not exist");
  }
}

export const notFoundUserHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof NotFoundUserError) {
    res.status(400);
    res.json({
      error: "BadRequest",
      message: "User does not exist",
    });
  } else {
    next(err);
  }
};
