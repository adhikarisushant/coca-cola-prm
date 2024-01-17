import express from "express";
import {
  createCompanyCode,
  editCompanyCode,
} from "../controllers/companyCode.controller";

const companyCodeRouter = express.Router();

companyCodeRouter.post("/company-code/create", createCompanyCode);
companyCodeRouter.put("/company-code/edit/:id", editCompanyCode);

export default companyCodeRouter;
