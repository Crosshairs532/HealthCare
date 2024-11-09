import { NextFunction, Request, Response, Router } from "express";
const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({ body: req.body });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;
