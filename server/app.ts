require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie  parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// routes
// app.use()

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});
