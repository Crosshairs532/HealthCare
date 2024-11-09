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
};
export const authService = {
  loginUser,
};
