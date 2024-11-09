import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtHelper } from "./../helper/generateToken";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { UserStatus } from "@prisma/client";

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
    "abcd",
    "2h"
  );
  const refreshToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdef",

    "2d"
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
    "abcd",
    "2h"
  );
  return {
    accessToken,
    needsPasswordChange: userData.needsPasswordChange,
  };
};
export const authService = {
  loginUser,
  refreshToken,
};
