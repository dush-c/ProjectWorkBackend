import { NextFunction, Response, Request } from "express";
import userService from "./user.service";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from "./user.model";
import { TypedRequest } from "../../utils/typed-request";

export const me = async (req: TypedRequest, res: Response, next: NextFunction) => {
  
  console.log("controller ME");

  res.json(req.user!);
};

export const confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
  const {token} = req.body;

  if(!token) {
    return res.status(400).send('Missing token');
  }

  try {
    // Verify the token
    const { userId } = jwt.verify(token, 'cicciopasticcio') as JwtPayload;

    // Find the user and confirm their email
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    user.isConfirmed = true;
    await user.save();

    return res.status(200).send('Email confirmed successfully');
} catch (err) {
    return res.status(400).send('Invalid or expired token');
}
};
export const list = async (req: Request, res: Response, next: NextFunction) => {
  const list = await userService.list();

  res.json(list);
};
