import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires_in: process.env.JWT_EXPIRES_IN,
    refreshToken: process.env.REFRESH_TOKEN,
    refreshToken_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_secret: process.env.RESET_SECRET,
    reset_token_expires_in: process.env.RESET_EXPIRETIME,
  },
  reset_pass: {
    email: process.env.EMAIL,
    email_password: process.env.EMAIL_PASSWORD,
  },
  cloudinary: {
    cloudinary_secret: process.env.CLOUDINARY_SECRET,
    cloudinary_key: process.env.CLOUDINARY_KEY,
    cloudinary_name: process.env.CLOUDINARY_NAME,
  },
};
