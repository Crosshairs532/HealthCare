import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../shared/pick";
import { pagination, searchItems } from "./admin.constant";
import prisma from "../../utils/prisma";
import sendResponse from "../../utils/sendResponse";

const getAllFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const param = req.query;
  const filter = pick(param, searchItems);
  const paginationItem = pick(param, pagination); //! page, limit
  try {
    const result = await adminService.getAllFromDB(filter, paginationItem);

    sendResponse(res, {
      success: true,
      status: 200,

      message: "All Admin Fetched",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const getByIdFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.getByIdFromDB(id);
  res.status(200).json({
    success: true,
    message: "Admin Fetched By Id !",
    data: result,
  });
};
const updateAdminDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await adminService.updateAdminDB(id, data);
  res.status(200).json({
    success: true,
    message: "Admin updated!",
    data: result,
  });
};
const DeleteFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await adminService.DeleteFromDB(id);
  res.status(200).json({
    success: true,
    message: "Admin deleted!",
    data: result,
  });
};
export const adminController = {
  getAllFromDB,
  getByIdFromDB,
  updateAdminDB,
  DeleteFromDB,
};
