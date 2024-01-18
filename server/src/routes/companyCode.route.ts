import express from "express";
import {
  createCompanyCode,
  editCompanyCode,
} from "../controllers/companyCode.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth";

const companyCodeRouter = express.Router();

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

export default companyCodeRouter;
