import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/common/utils/env";
import UserModel from "@/api/user/userModel";
import { logger } from "@/server";

export const verifyJWT: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      logger.info(`Token Not Found`);
      req.user = null;
      return next();
    }

    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload & { _id: string };
    const user = await UserModel.findById(decodedToken._id);

    if (user) {
      req.user = user;
    } else {
      logger.info(`Invalid Token, User Not Found`);
      req.user = null;
    }

    return next();
  } catch (err) {
    logger.info(`Auth middleware Error: ${err}`);
    req.user = null;
    return next();
  }
};
