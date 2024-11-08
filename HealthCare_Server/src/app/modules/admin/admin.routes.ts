import { NextFunction, Request, Response, Router } from "express";
import { adminController } from "./admin.controller";
import z from "zod";
const router = Router();

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});
const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({ body: req.body });
      next();
    } catch (error) {
      next(error);
    }
  };
};
router.get("/", adminController.getAllFromDB);
router.get("/:id", adminController.getByIdFromDB);
router.patch("/:id", validate(update), adminController.updateAdminDB);
router.delete("/:id", adminController.DeleteFromDB);
router.delete("/soft/:id", adminController.DeleteFromDB);
export const adminRoutes = router;
