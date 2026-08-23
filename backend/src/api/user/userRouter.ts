import { verifyJWT } from "@/common/middleware/authMiddleware";
import express, { type Router } from "express";
import { userController } from "./userController";

export const userRouter:Router = express.Router();

userRouter.get("/", verifyJWT, userController.getLoggedinUser);