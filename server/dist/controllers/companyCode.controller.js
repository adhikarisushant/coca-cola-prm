"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanyCode = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const db_1 = __importDefault(require("../db"));
// create company-code
exports.createCompanyCode = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { group_name, personal_area } = req.body;
        const isExist = yield db_1.default.query("SELECT * FROM company_codes WHERE group_name = $1 OR personal_area = $2;", [group_name, personal_area]);
        if ((isExist === null || isExist === void 0 ? void 0 : isExist.rows.length) > 0) {
            return next(new ErrorHandler_1.default("Company code already exists", 400));
        }
        const create = yield db_1.default.query("INSERT INTO company_codes (group_name, personal_area) VALUES ($1, $2) RETURNING *", [group_name, personal_area]);
        res.status(201).json({
            status: true,
            message: "Company Code Created Succcessfully.",
            result: create.rows,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));