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
exports.editCompanyCode = exports.createCompanyCode = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const db_1 = __importDefault(require("../db"));
// create company-code
exports.createCompanyCode = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { group_name, personal_area } = req.body;
        const isExist = yield db_1.default.query("SELECT * FROM company_codes WHERE group_name = $1 OR personal_area = $2;", [group_name, personal_area]);
        if ((isExist === null || isExist === void 0 ? void 0 : isExist.rows.length) > 0) {
            return next(new errorHandler_1.default("Company code already exists", 400));
        }
        const create = yield db_1.default.query("INSERT INTO company_codes (group_name, personal_area, created_by, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *", [group_name, personal_area, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id]);
        res.status(201).json({
            status: true,
            message: "Company Code Created Successfully.",
            result: create.rows,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// edit companyCode
exports.editCompanyCode = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { group_name, personal_area } = req.body;
        const id = req.params.id;
        const edit = yield db_1.default.query("UPDATE company_codes SET group_name = $1, personal_area = $2, updated_by = $3, updated_at= NOW() WHERE id = $4 RETURNING *", [group_name, personal_area, (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id, id]);
        res.status(201).json({
            status: true,
            message: "Company Code updated successfully",
            result: edit.rows,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
