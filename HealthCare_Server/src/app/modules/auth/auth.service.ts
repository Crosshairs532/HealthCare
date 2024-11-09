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
export const authService = {
  loginUser,
};
