import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import db from "../db";

// create company-code
export const createCompanyCode = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { group_name, personal_area } = req.body;

      const isExist = await db.query(
        "SELECT * FROM company_codes WHERE group_name = $1 OR personal_area = $2;",
        [group_name, personal_area]
      );

      if (isExist?.rows.length > 0) {
        return next(new ErrorHandler("Company code already exists", 400));
      }

      const create = await db.query(
        "INSERT INTO company_codes (group_name, personal_area) VALUES ($1, $2) RETURNING *",
        [group_name, personal_area]
      );

      res.status(201).json({
        status: true,
        message: "Company Code Created Succcessfully.",
        result: create.rows,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
