import { Router } from "express";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";
// import {add} from "./contoCorrente.controller";
const router = Router();

router.use(isAuthenticated);
// router.post("/nuovoConto", add);

export default router;