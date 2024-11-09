import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
  });
  sendResponse(res, {
    success: true,
    status: 200,
    message: "Login Success",
    data: {
      accessToken: result.accessToken,
      needsPasswordChange: result.needsPasswordChange,
    },
  });
});
export const authController = {
  loginUser,
};
