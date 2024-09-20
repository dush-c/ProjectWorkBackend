import { Router } from "express";
import { me } from "./user.controller";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.get("/me", isAuthenticated, me);
export default router;
