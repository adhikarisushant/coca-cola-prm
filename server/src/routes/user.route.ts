import express from "express";
import { createUser, loginUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/user/create", createUser);
userRouter.post("/user/login", loginUser);

export default userRouter;
