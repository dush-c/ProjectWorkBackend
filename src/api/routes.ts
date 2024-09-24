import { Router } from "express";
import userRouter from "./user/user.router";
import movimentiRouter from "./movimenti/movimenti.router";
import bonificoRouter from "./bonifico/bonifico.router";
import authRouter from "./auth/auth.router";
import categorieRouter from "./categoriaMovimenti/categoriaMovimenti.router";
import bankRouter from "./contoCorrente/contoCorrente.router";

const router = Router();

router.use("/users", userRouter);
router.use("/bankAccounts", bankRouter);
router.use("/movimenti", movimentiRouter);
router.use("/bonifico", bonificoRouter);
router.use("/categorieMovimenti", categorieRouter);
router.use(authRouter);

export default router;
