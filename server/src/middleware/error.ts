import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong jwt error
  if (err.code === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired, try again`;

    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({ success: false, message: err.message });
};
