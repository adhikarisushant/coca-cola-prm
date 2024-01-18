"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyCode_controller_1 = require("../controllers/companyCode.controller");
const auth_1 = require("../middleware/auth");
const companyCodeRouter = express_1.default.Router();
companyCodeRouter.post("/company-code/create", auth_1.isAuthenticated, auth_1.isAdmin, companyCode_controller_1.createCompanyCode);
companyCodeRouter.put("/company-code/edit/:id", auth_1.isAuthenticated, auth_1.isAdmin, companyCode_controller_1.editCompanyCode);
exports.default = companyCodeRouter;
