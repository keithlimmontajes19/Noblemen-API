import { Router } from "express";
import { UserConttoller } from "../contoller/user";

const router = Router();

router.get("/user", UserConttoller);

export default router;
