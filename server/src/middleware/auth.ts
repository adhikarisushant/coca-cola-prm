import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "./catchAsyncErrors";
import { Request, Response, NextFunction } from "express";
import db from "../db";

// authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        const user = await db.query("SELECT * FROM users where id = $1", [
          decoded.userId,
        ]);

        req.user = user;

        next();
      } catch (error: any) {
        return next(new ErrorHandler("Not authorized, no token", 401));
      }
    } else {
      return next(new ErrorHandler("Not authorized, no token", 401));
    }
  }
);

// User role is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return next(new ErrorHandler("User is not an admin", 401));
  }
};
