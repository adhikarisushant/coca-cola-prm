import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import db from "../db";
import generateToken from "../utils/GenerateToken";

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

      if (!name || !email || !password) {
        return next(
          new ErrorHandler("Please enter the value on all fields", 400)
        );
      }

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

// @desc    Login User
// @route   POST /user/login
// @access  Public

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      const findUser: any = await db.query(
        "SELECT * from users WHERE email = $1;",
        [email]
      );

      if (findUser?.rows.length < 1) {
        return next(
          new ErrorHandler("User not found, Please check the email", 400)
        );
      }

      // if user email found, compare password with bcrypt
      if (findUser.rows) {
        const comparePassword = await bcrypt.compare(
          password,
          findUser.rows[0].password
        );

        // if password matches
        // generate token with user's id and the secretKey in the env file

        if (comparePassword) {
          // generate token
          generateToken(res, findUser.rows[0].id);

          return res.status(201).json({
            status: true,
            message: "Login Successful!",
          });
        } else {
          return res.status(401).json({
            status: false,
            message: "Password does not match.",
          });
        }
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
