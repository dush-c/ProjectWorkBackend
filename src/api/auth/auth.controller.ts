import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../utils/typed-request.interface";
import { AddUserDTO } from "./auth.dto";
import { omit, pick } from "lodash";
// import { UserExistsError } from "../../errors/user-exists";
import userService from "../user/user.service";
import { UserExistsError } from "../../errors/user-exist";
import passport from "passport";
const JWT_SECRET = "my_jwt_secret";
import * as jwt from "jsonwebtoken";

import contoCorrenteService from "../contoCorrente/contoCorrente.service";
import { ContoCorrente } from "../contoCorrente/controCorrente.entity";
import generateIBAN from "../services/functions/generateIBAN.function";

export const add = async (
  req: TypedRequest<AddUserDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Include all user data required for the userService, omit only the password
    const userData = {
      ...omit(req.body, "password"), // We include 'email' and other data but omit 'password'
      isConfirmed: false,
      picture: req.body.picture
    };

    // Create credentials with both email (as username) and password
    // const credentials = {
    //   username: req.body.email, // Assuming email is used as username
    //   password: req.body.password,
    // };
    const credentials = pick(req.body, "username", "password");
    const newUser = await userService.add(userData, credentials);
    //dopo aver creato l'utente bisogna andarea a creare il conto corrente
    const contoData: ContoCorrente = {
      username: req.body.username,
      nomeTitolare: req.body.firstName,
      cognomeTitolare: req.body.lastName,
      password: req.body.password,
      IBAN: generateIBAN(),
    };
    const newConto = await contoCorrenteService.add(newUser, contoData);

    const createdUser = await userService.updateId(newUser.id!, newConto.id!);

    res.send(createdUser);
  } catch (err) {
    if (err instanceof UserExistsError) {
      res.status(400);
      res.send(err.message);
    } else {
      next(err);
    }
  }
}

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
}
