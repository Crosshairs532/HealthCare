import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", doctorController.getAllFromDB);
router.get("/:id", doctorController.getByIdFromDB);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  doctorController.updateInto
);

export const doctorRoutes = router;
