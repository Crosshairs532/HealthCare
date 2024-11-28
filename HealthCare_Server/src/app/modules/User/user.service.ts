import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import bcrypt, { hashSync } from "bcrypt";
import { fileUploader } from "../helper/fileUploader";
const prisma = new PrismaClient();
const createAdmin = async (req: any) => {
  const hashedPass = await hashSync(req.password, 12);
  const file = req.file;
  if (file) {
    const uploadToCloudinary = fileUploader.uploadImage(file);
    req.body.data.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const userData = {
    email: req.body.admin.email,
    password: hashedPass,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    });

    const admin = await tx.admin.create({
      data: req.body.admin,
    });
  });

  return result;
};
const createDoctor = async (req: any) => {
  const hashedPass = await hashSync(req.password, 12);
  const file = req.file;
  if (file) {
    const uploadToCloudinary = fileUploader.uploadImage(file);
    req.body.data.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const userData = {
    email: req.body.doctor.email,
    password: hashedPass,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    });

    const doctor = await tx.doctor.create({
      data: req.body.doctor,
    });
  });

  return result;
};
export const userService = {
  createAdmin,
  createDoctor,
};
