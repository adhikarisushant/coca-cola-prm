import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth";
import { createSalesOfficer } from "../controllers/salesOfficer.controller";

const salesOfficerRouter = express.Router();

salesOfficerRouter.post(
  "/sales-officer/create",
  isAuthenticated,
  isAdmin,
  createSalesOfficer
);

export default salesOfficerRouter;
