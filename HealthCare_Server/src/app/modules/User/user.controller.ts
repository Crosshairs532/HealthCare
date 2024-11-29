import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import pick from "../../shared/pick";
import { userFilterableFields } from "./user.constants";
import { pagination } from "../admin/admin.constant";
import sendResponse from "../../utils/sendResponse";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = (req: Request, res: Response) => {
  try {
    const result = userService.createAdmin(req);
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

const createDoctor = (req: Request, res: Response) => {
  try {
    const result = userService.createDoctor(req);
    res.status(200).send({
      success: true,
      message: "Doctor  created successfully",
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

const getAllFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const param = req.query;
    const filter = pick(param, userFilterableFields);
    const paginationItem = pick(param, pagination); //! page, limit

    const result = await userService.getAllFromDB(filter, paginationItem);

    sendResponse(res, {
      success: true,
      status: 200,

      message: "All users Fetched",
      meta: result.meta,
      data: result.data,
    });
  }
);

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Profile status changed successfully",
    data: result,
  });
});
const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userService.getMyProfile(user);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Profile fetched successfully",
      data: result,
    });
  }
);
const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req?.user;

    const result = await userService.updateMyProfile(user, req);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "profile Updated",
      data: result,
    });
  }
);

export const userController = {
  createAdmin,
  createDoctor,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
