"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyCode_controller_1 = require("../controllers/companyCode.controller");
const companyCodeRouter = express_1.default.Router();
companyCodeRouter.post("/create-company-code", companyCode_controller_1.createCompanyCode);
exports.default = companyCodeRouter;
