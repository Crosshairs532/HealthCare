import { Router } from "express";
import { fileUploader } from "../helper/fileUploader";
import { specialtiesController } from "./specialties.controller";

const router = Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  specialtiesController.insertInto
);

export const SpecialtiesRoutes = {};
