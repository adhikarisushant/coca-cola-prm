import express from "express";
import { createUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/user/create", createUser);

export default userRouter;
