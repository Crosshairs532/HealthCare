import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.loginUser);
router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  authController.changePassword
);

router.post("/forgot-password", auth(), authController.forgotPassword);
router.post("/forgot-password", authController.resetPassword);
export const authRoutes = router;
