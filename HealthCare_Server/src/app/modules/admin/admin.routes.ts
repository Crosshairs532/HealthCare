import { adminController } from "./admin.controller";
import z from "zod";
import validate from "../../middlewares/validate";
import { Router } from "express";
import { adminvalidation } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAllFromDB
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getByIdFromDB
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate(adminvalidation.update),
  adminController.updateAdminDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.DeleteFromDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.DeleteFromDB
);

export const adminRoutes = router;
