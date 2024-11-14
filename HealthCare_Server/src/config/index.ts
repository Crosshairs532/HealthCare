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
  },
};
