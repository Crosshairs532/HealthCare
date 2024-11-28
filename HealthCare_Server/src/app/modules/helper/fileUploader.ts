import multer from "multer";
import path, { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";
import config from "../../../config";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../../interfaces/file";
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_key,
  api_secret: config.cloudinary.cloudinary_secret, // Click 'View API Keys' above to copy your API secret
});

// Upload an image
const uploadImage = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      // {
      //   public_id: file.originalname,
      // },
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export const fileUploader = {
  upload,
  uploadImage,
};
