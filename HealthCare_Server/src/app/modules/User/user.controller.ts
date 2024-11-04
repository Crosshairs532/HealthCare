import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = (req: Request, res: Response) => {
  try {
    const result = userService.createAdmin(req.body);
    res.status(200).send({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error?.name || "Something Went Wrong !",
      error: error,
    });
  }
};
export const userController = {
  createAdmin,
};
