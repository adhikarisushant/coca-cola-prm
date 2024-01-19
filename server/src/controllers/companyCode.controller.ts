import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import db from "../db";

// @desc    Get All Company Codes
// @route   GET /company-code/all
// @access  Admin

export const getAllCompanyCode = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allData = await db.query("SELECT * FROM company_codes;", []);

      res.status(201).json({
        status: true,
        message: "Fetched all Company Codes Successfully.",
        result: allData.rows,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// @desc    Get Single Company Code
// @route   GET /company-code/single/:id
// @access  Admin

export const getSingleCompanyCode = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const singleData = await db.query(
        "SELECT * FROM company_codes WHERE id= $1;",
        [id]
      );

      res.status(201).json({
        status: true,
        message: "Fetched all Company Codes Successfully.",
        result: singleData.rows,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// @desc    Create Company Code
// @route   POST /company-code/create
// @access  Admin

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

// @desc    Edit Company Code
// @route   PUT /company-code/edit/:id
// @access  Admin

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

// @desc    Delete Company Code
// @route   DELETE /company-code/delete/:id
// @access  Admin

export const deleteCompanyCode = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const dataDelete = await db.query(
        "DELETE FROM company_codes WHERE id=$1 RETURNING *;",
        [id]
      );

      res.status(201).json({
        status: true,
        message: "Company Code Deleted Successfully",
        result: dataDelete.rows,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
