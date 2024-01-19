import express from "express";
import {
  createCompanyCode,
  deleteCompanyCode,
  editCompanyCode,
  getAllCompanyCode,
  getSingleCompanyCode,
} from "../controllers/companyCode.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth";

const companyCodeRouter = express.Router();

companyCodeRouter.get(
  "/company-code/single/:id",
  isAuthenticated,
  isAdmin,
  getSingleCompanyCode
);

companyCodeRouter.get(
  "/company-code/all",
  isAuthenticated,
  isAdmin,
  getAllCompanyCode
);

companyCodeRouter.post(
  "/company-code/create",
  isAuthenticated,
  isAdmin,
  createCompanyCode
);
companyCodeRouter.put(
  "/company-code/edit/:id",
  isAuthenticated,
  isAdmin,
  editCompanyCode
);

companyCodeRouter.delete(
  "/company-code/delete/:id",
  isAuthenticated,
  isAdmin,
  deleteCompanyCode
);

export default companyCodeRouter;
