import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

import { Router } from "express";
import { fileUploader } from "../helper/fileUploader";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),

  userController.createAdmin
);

export const userRoutes = router;
