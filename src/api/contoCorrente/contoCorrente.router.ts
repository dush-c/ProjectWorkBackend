import { Router } from "express";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";
import { info } from "./contoCorrente.controller";
// import {add} from "./contoCorrente.controller";
const router = Router();

router.use(isAuthenticated);
// router.post("/nuovoConto", add);
router.get("/info", info);

export default router;