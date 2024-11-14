import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtHelper } from "../helper/generateToken";
import config from "../../../config";

const router = Router();

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error("You are not authorized!");
    }
    const verifiedUser = jwtHelper.verifyToken(
      token,
      config.jwt.jwt_secret as string
    );

    if (verifiedUser && !roles.includes(verifiedUser.role)) {
      throw new Error("You are not authorized!");
    }
    next();
  };
};

router.get("/", auth("ADMIN"), userController.createAdmin);

export const userRoutes = router;
