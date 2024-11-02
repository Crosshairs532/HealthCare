import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = (req: Request, res: Response) => {
  console.log(req.body);
  const result = userService.createAdmin(req.body);
  res.send(result);
};
export const userController = {
  createAdmin,
};
