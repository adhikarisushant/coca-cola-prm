import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import db from "../db";
import verifyToken from "../utils/verifyToken";

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
        "INSERT INTO company_codes (group_name, personal_area, created_by, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
        [group_name, personal_area, req?.user?.id]
      );

      res.status(201).json({
        status: true,
        message: "Company Code Created Successfully.",
        result: create.rows,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit companyCode

export const editCompanyCode = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { group_name, personal_area } = req.body;

      const id = req.params.id;

      const edit = await db.query(
        "UPDATE company_codes SET group_name = $1, personal_area = $2, updated_by = $3, updated_at= NOW() WHERE id = $4 RETURNING *",
        [group_name, personal_area, req?.user?.id, id]
      );

      res.status(201).json({
        status: true,
        message: "Company Code updated successfully",
        result: edit.rows,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
