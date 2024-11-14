import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

import { Router } from "express";

const router = Router();

router.get("/", auth(UserRole.ADMIN), userController.createAdmin);

export const userRoutes = router;
