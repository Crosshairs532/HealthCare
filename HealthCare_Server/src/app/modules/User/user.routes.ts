import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../helper/fileUploader";
import { userValidation } from "./user.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(req.body.data);
    return userController.createAdmin(req, res);
  },
  userController.createAdmin
);

export const userRoutes = router;
