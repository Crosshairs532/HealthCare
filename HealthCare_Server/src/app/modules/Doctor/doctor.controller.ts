import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorService } from "./doctor.service";

const updateInto = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.updateIntoDB(id, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor data updated!",
    data: result,
  });
});

export const doctorController = {
  updateInto,
};
