import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllFromDB = async (req: Request, res: Response) => {
  const param = req.query;
  try {
    const result = await adminService.getAllFromDB(param);
    res.status(200).send({
      success: true,
      message: "All Admin Fetched",
      data: result,
    });
  } catch (error: any) {
    res.status(500).send({
      success: true,
      message: error?.name || "something went wrong on fetching!",
      error: error,
    });
  }
};
export const adminController = {
  getAllFromDB,
};
