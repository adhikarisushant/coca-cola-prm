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
exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const db_1 = __importDefault(require("../db"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
exports.createUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(new errorHandler_1.default("Please enter the value on all fields", 400));
        }
        const isEmailExist = yield db_1.default.query("SELECT email FROM users WHERE email = $1;", [email]);
        if ((isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.rows.length) > 0) {
            return next(new errorHandler_1.default("Email already exists", 400));
        }
        const passwordHashed = yield bcrypt_1.default.hash(password, 10);
        //   save user
        const user = yield db_1.default.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3);", [name, email, passwordHashed]);
        res.status(201).json({
            status: true,
            message: "User successfully registered!",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const findUser = yield db_1.default.query("SELECT * from users WHERE email = $1;", [email]);
        if ((findUser === null || findUser === void 0 ? void 0 : findUser.rows.length) < 1) {
            return next(new errorHandler_1.default("User not found, Please check the email", 400));
        }
        // if user email found, compare password with bcrypt
        if (findUser.rows) {
            const comparePassword = yield bcrypt_1.default.compare(password, findUser.rows[0].password);
            // if password matches
            // generate token with user's id and the secretKey in the env file
            if (comparePassword) {
                // generate token
                (0, generateToken_1.default)(res, findUser.rows[0].id);
                return res.status(201).json({
                    status: true,
                    message: "Login Successful!",
                });
            }
            else {
                return res.status(401).json({
                    status: false,
                    message: "Password does not match.",
                });
            }
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
