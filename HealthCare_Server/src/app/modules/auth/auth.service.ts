import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import jwt from "jsonwebtoken";
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

  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcd",
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdef",
    {
      expiresIn: "2d",
    }
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
