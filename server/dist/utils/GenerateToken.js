"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    //   setJWT as an HTTP-Only Cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // use secure cookies in production
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};
exports.default = generateToken;
