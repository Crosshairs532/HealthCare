import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../modules/helper/generateToken";
import config from "../../config";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "You are not authorized!"
      );
    }
    const verifiedUser = jwtHelper.verifyToken(
      token,
      config.jwt.jwt_secret as string
    );

    req.user = verifiedUser;
    if (verifiedUser && !roles.includes(verifiedUser.role)) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "You are not authorized!"
      );
    }
    next();
  };
};

export default auth;
