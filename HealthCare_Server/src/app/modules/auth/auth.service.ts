import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelper } from "./../helper/generateToken";
import bcrypt, { hashSync } from "bcrypt";
import prisma from "../../utils/prisma";
import { UserRole, UserStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordCorrect: Boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Password Incorrect");
  }

  const accessToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.jwt_secret as string
  );
  const refreshToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refreshToken as string,

    config.jwt.refreshToken_expires_in as string
  );

  return {
    accessToken,
    needsPasswordChange: userData.needsPasswordChange,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  let DecodedToken;

  try {
    DecodedToken = jwtHelper.verifyToken(refreshToken, "abcde");
  } catch (error) {
    throw new Error("Your are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: DecodedToken?.email,
      status: UserStatus.ACTIVE,
    },
  });
  const accessToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refreshToken as string,
    config.jwt.refreshToken_expires_in as string
  );
  return {
    accessToken,
    needsPasswordChange: userData.needsPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordCorrect: Boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Password Incorrect");
  }
  const hashedPass = await hashSync(payload.newPassword, 12);

  const passChanged = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPass,
    },
  });

  return passChanged;
};

const forgotPassword = async ({ email }: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = jwtHelper.generateToken(
    userData,
    config.jwt.reset_secret as string,
    config.jwt.reset_token_expires_in as string
  );
  const frontendLink = `https://localhost:3000/reset-pass?email=${email}&token=${resetPassToken}`;
  await emailSender(
    userData.email,

    `
  <div>
      <p>Dear User,</p>
      <p>Reset password Link : 
        <a href=${frontendLink}>
            Reset Password Link
        </a>
      </p>
  </div>
`
  );
};

const resetPassword = async (token: string, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const verifyToken = jwtHelper.verifyToken(
    token,
    config.jwt.reset_secret as string
  );
  if (!verifyToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized!");
  }
  // hash Pass
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const updated = await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
