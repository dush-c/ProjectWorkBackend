import { Router } from "express";
import userRouter from "./user/user.router";
import authRouter from "./auth/auth.router";
import bankRouter from "./contoCorrente/contoCorrente.router";
const router = Router();

router.use("/users", userRouter);
router.use("/bankAccounts", bankRouter);
router.use(authRouter);

export default router;
