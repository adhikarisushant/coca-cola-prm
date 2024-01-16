import express from "express";
import { createCompanyCode } from "../controllers/companyCode.controller";

const companyCodeRouter = express.Router();

companyCodeRouter.post("/create-company-code", createCompanyCode);

export default companyCodeRouter;
