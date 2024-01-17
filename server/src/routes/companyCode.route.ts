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
  createCompanyCode
);
companyCodeRouter.put("/company-code/edit/:id", editCompanyCode);

export default companyCodeRouter;
