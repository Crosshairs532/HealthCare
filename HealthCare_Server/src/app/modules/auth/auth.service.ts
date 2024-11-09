import jwt from "jsonwebtoken";
import { jwtHelper } from "./../helper/generateToken";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
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
    const DecodedToken = jwt.verify(refreshToken, "abcde");
  } catch (error) {
    throw new Error("Your are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: DecodedToken?.email,
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
