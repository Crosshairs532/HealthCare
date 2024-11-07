import { error } from "console";
import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  jsonData: {
    success: boolean;
    status: number;
    message: string;
    error?: any;
    data?: T;
    meta?:
      | {
          page: number;
          limit: number;
        }
      | null
      | undefined;
  }
) => {
  return res.status(jsonData.status).send({
    success: jsonData.success,
    status: jsonData.status,
    message: jsonData.message,
    data: jsonData.data,
    meta: jsonData.meta || null || undefined,
    error: jsonData.error || null || undefined,
  });
};

export default sendResponse;
