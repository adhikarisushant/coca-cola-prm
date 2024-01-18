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
exports.isAdmin = exports.isAuthenticated = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const db_1 = __importDefault(require("../db"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
// authenticated user
exports.isAuthenticated = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = yield (0, verifyToken_1.default)(token);
            const user = (yield db_1.default.query("SELECT id, role FROM users where id = $1", [decoded.userId]));
            req.user = user === null || user === void 0 ? void 0 : user.rows[0];
            next();
        }
        catch (error) {
            return next(new errorHandler_1.default("Not authorized, no token", 401));
        }
    }
    else {
        return next(new errorHandler_1.default("Not authorized, no token", 401));
    }
}));
// User role is admin
exports.isAdmin = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) === "admin") {
        next();
    }
    else {
        return next(new errorHandler_1.default("User is not an admin", 401));
    }
}));
