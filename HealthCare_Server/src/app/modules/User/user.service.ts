import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import bcrypt, { hashSync } from "bcrypt";
import { fileUploader } from "../helper/fileUploader";
const prisma = new PrismaClient();
const createAdmin = async (req: any) => {
  const hashedPass = await hashSync(req.password, 12);
  const file = req.file;
  if (file) {
    const uploadToCloudinary = fileUploader.uploadImage(file);
    req.body.data.admin.profilePhoto = uploadToCloudinary;
  }

  // const userData = {
  //   email: data.admin.email,
  //   password: hashedPass,
  //   role: UserRole.ADMIN,
  // };

  // const result = await prisma.$transaction(async (tx) => {
  //   const user = await tx.user.create({
  //     data: userData,
  //   });

  //   const admin = await tx.admin.create({
  //     data: data.admin,
  //   });
  // });

  // return result;
};
export const userService = {
  createAdmin,
};
