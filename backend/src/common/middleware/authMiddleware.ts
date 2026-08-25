import type {
  NextFunction,
  Request,
  Response,
  RequestHandler,
} from "express";

import jwt from "jsonwebtoken";

import { env } from "../utils/env.js";
import UserModel from "../../api/user/userModel.js";
import { logger } from "../../server.js";

export const verifyJWT: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req
        .header("Authorization")
        ?.replace("Bearer ", "");

    // No token
    if (!token) {
      logger.info("Token Not Found");

      req.user = null;

      return next();
    }

    // Verify token
    const decodedToken = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET,
    ) as jwt.JwtPayload & {
      _id: string;
    };

    // Find user
    const user = await UserModel.findById(
      decodedToken._id,
    );

    if (user) {
      req.user = user;
    } else {
      logger.info(
        "Invalid Token, User Not Found",
      );

      req.user = null;
    }

    return next();
  } catch (err) {
    logger.info(
      `Auth middleware Error: ${err}`,
    );

    req.user = null;

    return next();
  }
};
