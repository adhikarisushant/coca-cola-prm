"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    // wrong jwt error
    if (err.code === "JsonWebTokenError") {
        const message = `Json web token is invalid, try again`;
        err = new errorHandler_1.default(message, 400);
    }
    // jwt expired error
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired, try again`;
        err = new errorHandler_1.default(message, 400);
    }
    res.status(err.statusCode).json({ success: false, message: err.message });
};
exports.ErrorMiddleware = ErrorMiddleware;
