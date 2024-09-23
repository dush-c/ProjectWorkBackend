import { Router } from "express";
import { confirmEmail, me, updatePassword } from "./user.controller";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.get("/me", isAuthenticated, me);
router.get("/email-confirmation", confirmEmail);
router.put("/updatePassword",isAuthenticated, updatePassword);
export default router;
