import express, { type Router } from "express";

import { verifyJWT } from "../../common/middleware/authMiddleware.js";
import { userController } from "./userController.js";

export const userRouter: Router = express.Router();

userRouter.get(
  "/",
  verifyJWT,
  userController.getLoggedinUser,
);
