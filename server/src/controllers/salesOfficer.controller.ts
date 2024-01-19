import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/errorHandler";
import db from "../db";

// @desc    Create Sales Officer
// @route   POST /sales-officer/create
// @access  Admin

export const createSalesOfficer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, sap_id, name, company_code_id } = req.body;

      const isExist = await db.query(
        "SELECT * FROM sales_officers WHERE sap_id = $1;",
        [sap_id]
      );

      if (isExist?.rows.length > 0) {
        return next(
          new ErrorHandler("Sales Officers SAP ID already exists", 400)
        );
      }

      const isEmailExist = await db.query(
        "SELECT * FROM users WHERE email = $1;",
        [email]
      );

      if (isEmailExist?.rows.length > 0) {
        return next(
          new ErrorHandler("Sales Officer Email already exists", 400)
        );
      }

      const passwordHashed = await bcrypt.hash(password, 10);

      const user: any = await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, passwordHashed]
      );

      if (user?.rows.length > 0) {
        const create = await db.query(
          "INSERT INTO sales_officers (sap_id, name, company_code_id, user_id, created_by, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
          [sap_id, name, company_code_id, user.rows[0].id, req?.user?.id]
        );

        res.status(201).json({
          status: true,
          message: "Sales Officer Created Successfully",
          result: create.rows,
          user: user.rows,
        });
      } else {
        return next(
          new ErrorHandler("failed to create sales officer as user", 400)
        );
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// @desc    Edit Sales Officer
// @route   PUT /sales-officer/edit/:id
// @access  Admin

export const editSalesOfficer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, sap_id, name, company_code_id, user_id } =
        req.body;

      const id = req.params.id;

      const isExist = await db.query(
        "SELECT * FROM sales_officers WHERE sap_id = $1 AND NOT id = $2;",
        [sap_id, id]
      );

      if (isExist?.rows.length > 0) {
        return next(
          new ErrorHandler("Sales Officers SAP ID already exists", 400)
        );
      }

      const isEmailExist = await db.query(
        "SELECT * FROM users WHERE email = $1 AND NOT id = $2;",
        [email, user_id]
      );

      if (isEmailExist?.rows.length > 0) {
        return next(
          new ErrorHandler("Sales Officer Email already exists", 400)
        );
      }

      // hash password
      const passwordHashed = await bcrypt.hash(password, 10);

      // update email, password in user
      const userUpdated = await db.query(
        "UPDATE users SET name = $1 , email = $2 , password = $3 WHERE id = $4 RETURNING name, email, role",
        [name, email, passwordHashed, user_id]
      );

      // update in sales officer table
      const salesUpdated = await db.query(
        "UPDATE sales_officers SET sap_id = $1, name = $2, company_code_id = $3, updated_by = $4, updated_at = NOW() WHERE id = $5 RETURNING *",
        [sap_id, name, company_code_id, req?.user?.id, id]
      );

      res.status(201).json({
        status: true,
        message: "Sales Officer updated successfully",
        result: salesUpdated.rows,
        user: userUpdated.rows,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
