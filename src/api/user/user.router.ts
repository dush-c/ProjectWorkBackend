import { Router } from "express";
import { confirmEmail, me } from "./user.controller";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.get("/me", isAuthenticated, me);
router.get("/email-confirmation", confirmEmail);
export default router;
