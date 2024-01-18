import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler";
import { CatchAsyncError } from "./catchAsyncErrors";
import { Request, Response, NextFunction } from "express";
import db from "../db";
import verifyToken from "../utils/verifyToken";

interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

// authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = await verifyToken(token);

        const user: any = (await db.query("SELECT * FROM users where id = $1", [
          decoded.userId,
        ])) as any;

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
export const isAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.cookies.jwt) {
        return next(new ErrorHandler("no token", 401));
      }

      const decoded = await verifyToken(req.cookies.jwt);

      const user: any = (await db.query("SELECT * FROM users where id = $1", [
        decoded.userId,
      ])) as any;

      if (user?.rows.length < 1) {
        return next(new ErrorHandler("user not found", 401));
      }

      if (user?.rows[0].role === "admin") {
        next();
      } else {
        return next(new ErrorHandler("User is not an admin", 401));
      }
    } catch (error: any) {
      return next(new ErrorHandler("Not authorized, no token", 401));
    }
  }
);
