import { ErrorRequestHandler, Request, Response } from "express";

const globalErrorhandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response
) => {
  res.status(500).send({
    success: false,
    message: err.name || "something went wrong ",
    error: err,
  });
};

export default globalErrorhandler;
