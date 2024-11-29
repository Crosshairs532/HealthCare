import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../helper/fileUploader";
import prisma from "../../utils/prisma";

const insetIntoDB = async (req: Request) => {
  const file = req.file as IFile;
  if (file) {
    const uploaded = await fileUploader.uploadImage(file);
    req.body.icon = uploaded?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

export const specialtiesService = {
  insetIntoDB,
};
