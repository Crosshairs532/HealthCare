import jwt from "jsonwebtoken";
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

export const jwtHelper = {
  generateToken,
};
