import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/", adminController.getAllFromDB);
router.get("/:id", adminController.getByIdFromDB);
router.patch("/:id", adminController.updateAdminDB);
router.delete("/:id", adminController.DeleteFromDB);
router.delete("/soft/:id", adminController.DeleteFromDB);
export const adminRoutes = router;
