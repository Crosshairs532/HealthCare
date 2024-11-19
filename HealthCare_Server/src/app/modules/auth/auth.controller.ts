import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

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

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    status: 200,
    message: "Login Success",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const payload = req.body;

    const result = authService.changePassword(user, payload);

    sendResponse(res, {
      success: true,
      status: 200,
      message: "Password Changed successfully!",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body);

  sendResponse(res, {
    success: true,
    status: 200,
    message: "",
    data: result,
  });
});
export const authController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
};
