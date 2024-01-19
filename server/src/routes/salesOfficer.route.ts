import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth";
import {
  createSalesOfficer,
  editSalesOfficer,
} from "../controllers/salesOfficer.controller";

const salesOfficerRouter = express.Router();

salesOfficerRouter.post(
  "/sales-officer/create",
  isAuthenticated,
  isAdmin,
  createSalesOfficer
);

salesOfficerRouter.put(
  "/sales-officer/edit/:id",
  isAuthenticated,
  isAdmin,
  editSalesOfficer
);

export default salesOfficerRouter;
