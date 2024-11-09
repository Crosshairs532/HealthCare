import jwt, { JwtPayload, Secret } from "jsonwebtoken";
const generateToken = (payload: any, secret: string, expireTime: string) => {
  const token = jwt.sign(
    {
      email: payload.email,
      role: payload.role,
    },
    "abcd",
    {
      expiresIn: "1h",
      algorithm: "HS256",
    }
  );

  return token;
};

const verifyToken = (refreshToken: string, secret: Secret) => {
  return jwt.verify(refreshToken, secret) as JwtPayload;
};

export const jwtHelper = {
  generateToken,
  verifyToken,
};
