import { adminController } from "./admin.controller";
import z from "zod";
import validate from "../../middlewares/validate";
import { Router } from "express";
import { adminvalidation } from "./admin.validation";
const router = Router();

router.get("/", adminController.getAllFromDB);
router.get("/:id", adminController.getByIdFromDB);
router.patch(
  "/:id",
  validate(adminvalidation.update),
  adminController.updateAdminDB
);
router.delete("/:id", adminController.DeleteFromDB);
router.delete("/soft/:id", adminController.DeleteFromDB);
export const adminRoutes = router;
