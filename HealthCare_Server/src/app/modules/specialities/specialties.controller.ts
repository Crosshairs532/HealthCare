import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { specialtiesService } from "./specialties.service";
import sendResponse from "../../utils/sendResponse";

const insertInto = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.insetIntoDB(req);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Specialties Created",
    data: result,
  });
});

export const specialtiesController = {
  insertInto,
};
