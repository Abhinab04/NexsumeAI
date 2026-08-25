import express, { type Router } from "express";

import { authController } from "./authController.js";
import { verifyJWT } from "../../common/middleware/authMiddleware.js";

export const authRouter: Router = express.Router();

authRouter.post(
  "/login",
  authController.loginUser,
);

authRouter.get(
  "/login/verify/:token",
  authController.loginWithToken,
);

authRouter.post(
  "/login/refresh",
  authController.refreshAccessToken,
);

authRouter.get(
  "/logout",
  verifyJWT,
  authController.logoutUser,
);
