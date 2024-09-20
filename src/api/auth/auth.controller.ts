import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../utils/typed-request.interface";
import { AddUserDTO } from "./auth.dto";
import { omit, pick } from "lodash";
import userService from "../user/user.service";
import { UserExistsError } from "../../errors/user-exist";
import passport from "passport";
const JWT_SECRET = "my_jwt_secret";
import * as jwt from "jsonwebtoken";

export const add = async (
  req: TypedRequest<AddUserDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Include required fields such as 'isConfirmed' and 'contoCorrenteId'
    const userData = {
      ...omit(req.body, "username", "password"),
      isConfirmed: false,  // Or true, depending on your logic
      contoCorrenteId: "default-id",  // Example, replace with actual logic
    };

    const credentials = pick(req.body, "username", "password");
    const newUser = await userService.add(userData, credentials);
    res.send(newUser);
  } catch (err) {
    if (err instanceof UserExistsError) {
      res.status(400);
      res.send(err.message);
    } else {
      next(err);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authMiddleware = passport.authenticate("local", (err, user, info) => {
      if (err) {
        next(err);
        return;
      }

      if (!user) {
        res.status(401);
        res.json({
          error: "LoginError",
          message: info.message,
        });
        return;
      }

      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7 days" });

      res.status(200);
      res.json({
        user,
        token,
      });
    });

    authMiddleware(req, res, next);
  } catch (e) {
    next(e);
  }
};
