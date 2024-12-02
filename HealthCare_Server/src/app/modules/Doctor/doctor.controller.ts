import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorService } from "./doctor.service";
import pick from "../../shared/pick";
import { doctorFilterableFields } from "./doctor.constants";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await doctorService.getAllFromDB(filters, options);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctors retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.getByIdFromDB(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

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
  getAllFromDB,
  getByIdFromDB,
};
