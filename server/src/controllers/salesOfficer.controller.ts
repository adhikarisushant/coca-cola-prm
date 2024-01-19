import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import db from "../db";

// @desc    Create Sales Officer
// @route   POST /sales-officer/create
// @access  Admin

export const createSalesOfficer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sap_id, name, company_code_id } = req.body;

      const isExist = await db.query(
        "SELECT * FROM sales_officers WHERE sap_id = $1;",
        [sap_id]
      );

      if (isExist?.rows.length > 0) {
        return next(
          new ErrorHandler("Sales Officers SAP ID already exists", 400)
        );
      }

      const create = await db.query(
        "INSERT INTO sales_officers (sap_id, name, company_code_id, created_by, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
        [sap_id, name, company_code_id, req?.user?.id]
      );

      res.status(201).json({
        status: true,
        message: "Sales Officer Created Successfully",
        result: create.rows,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
