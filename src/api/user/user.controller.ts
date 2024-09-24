import { NextFunction, Response, Request } from "express";
import userService from "./user.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TypedRequest } from "../../utils/typed-request";
import { UserModel } from "./user.model";
import { User } from "./user.entity";
import { MovimentoContoCorrente } from "../movimenti/movimenti.entity";

export const me = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  res.json(req.user!);
};

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send("Missing token");
  }

  try {
    // Verify the token
    const { userId } = jwt.verify(token, "cicciopasticcio") as JwtPayload;

    // Find the user and confirm their email
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.isConfirmed = true;
    await user.save();
    //here i have to add the code for the creation of the record in the TMovimentiContoCorrente
    //TODO: aggiungere record nella collecition movements

    const contoId = user.contoCorrenteId;
    const aperturaConto: MovimentoContoCorrente = {
      categoriaMovimentoID: "66f180ef3af4b7f8c8ca9184",
      contoCorrenteID: contoId!,
      data: new Date(),
      importo: 0,
      saldo: 0,
      descrizioneEstesa: "Apertura Conto"

    }

    return res.status(200).send("Email confirmed successfully");
  } catch (err) {
    return res.status(400).send("Invalid or expired token");
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user! as User;

    const { newPassword, confirmPassword } = req.body;

    const updatedUser = await userService.updatePassword(
      user,
      newPassword,
      confirmPassword
    );

    res.json(updatedUser);
    res.status(200);
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const list = await userService.list();

  res.json(list);
};
