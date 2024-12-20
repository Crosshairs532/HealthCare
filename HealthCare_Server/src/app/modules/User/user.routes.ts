import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../helper/fileUploader";
import { userValidation } from "./user.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getAllFromDB
);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getMyProfile
);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(req.body.data);
    return userController.createAdmin(req, res);
  },
  userController.createAdmin
);
router.post(
  "/create-doctor",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(req.body.data);
    return userController.createAdmin(req, res);
  },
  userController.createAdmin
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.changeProfileStatus
);
router.patch(
  "/update-profile",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  // (req: Request, res: Response, next: NextFunction) => {
  //   req.body = userValidation.createAdmin.parse(req.body.data);
  //   return userController.createAdmin(req, res);
  // },
  userController.updateMyProfile
);

export const userRoutes = router;
