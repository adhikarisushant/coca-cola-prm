import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler";
import { CatchAsyncError } from "./catchAsyncErrors";
import { Request, Response, NextFunction } from "express";
import db from "../db";
import verifyToken from "../utils/verifyToken";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
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

        const user: any = (await db.query(
          "SELECT id, role FROM users where id = $1",
          [decoded.userId]
        )) as any;

        req.user = user?.rows[0];

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
    if (req?.user?.role === "admin") {
      next();
    } else {
      return next(new ErrorHandler("User is not an admin", 401));
    }
  }
);
