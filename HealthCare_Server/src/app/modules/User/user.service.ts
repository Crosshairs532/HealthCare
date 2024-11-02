import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import bcrypt, { hashSync } from "bcrypt";
const prisma = new PrismaClient();
const createAdmin = async (data: any) => {
  const hashedPass = await hashSync(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashedPass,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    });

    const admin = await tx.admin.create({
      data: data.admin,
    });
  });

  return result;
};
export const userService = {
  createAdmin,
};
