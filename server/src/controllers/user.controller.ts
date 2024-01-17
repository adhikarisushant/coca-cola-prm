import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import db from "../db";

// @desc    Register User
// @route   POST /user/create
// @access  Public

interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const createUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body as IRegisterRequest;

      const isEmailExist = await db.query(
        "SELECT email FROM users WHERE email = $1;",
        [email]
      );

      if (isEmailExist?.rows.length > 0) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const passwordHashed = await bcrypt.hash(password, 10);

      //   save user
      const user = await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3);",
        [name, email, passwordHashed]
      );

      res.status(201).json({
        status: true,
        message: "User successfully registered!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// login user
