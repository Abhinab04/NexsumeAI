import type {
  Request,
  RequestHandler,
  Response,
} from "express";

import { StatusCodes } from "http-status-codes";

import { authService } from "./authService.js";
import { env } from "../../common/utils/env.js";

class AuthController {
  public loginUser: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const userAgent =
      req.headers["user-agent"] || "";

    const loginServiceResponse =
      await authService.loginUser(
        req.body,
        userAgent,
      );

    res
      .status(loginServiceResponse.statusCode)
      .send(loginServiceResponse);
  };

  public loginWithToken: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    const { token } = req.params;

    const loginWithTokenResponse =
      await authService.loginWithToken(token);

    if (loginWithTokenResponse.success) {
      res
        .status(
          loginWithTokenResponse.statusCode,
        )
        .cookie(
          "accessToken",
          loginWithTokenResponse.responseObject
            ?.accessToken,
          cookieOptions,
        )
        .cookie(
          "refreshToken",
          loginWithTokenResponse.responseObject
            ?.refreshToken,
          cookieOptions,
        )
        .redirect(
          `${env.CORS_ORIGIN}/dashboard`,
        );
    } else {
      res
        .status(
          loginWithTokenResponse.statusCode,
        )
        .render("login-failed", {
          fontend_url: env.CORS_ORIGIN,
        });
    }
  };

  public refreshAccessToken: RequestHandler =
    async (
      req: Request,
      res: Response,
    ) => {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
      };

      const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken ||
        "";

      const refreshAccessTokenResponse =
        await authService.refreshAccessToken(
          incomingRefreshToken,
        );

      if (refreshAccessTokenResponse.success) {
        res
          .status(
            refreshAccessTokenResponse.statusCode,
          )
          .cookie(
            "accessToken",
            refreshAccessTokenResponse
              .responseObject?.accessToken,
            cookieOptions,
          )
          .cookie(
            "refreshToken",
            refreshAccessTokenResponse
              .responseObject?.refreshToken,
            cookieOptions,
          )
          .send(refreshAccessTokenResponse);
      } else {
        res
          .status(
            refreshAccessTokenResponse.statusCode,
          )
          .send(refreshAccessTokenResponse);
      }
    };

  public logoutUser: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    const userId = req.user?._id as
      | string
      | undefined;

    if (!userId) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send("Unauthorized");
      return;
    }

    const logoutUserResponse =
      await authService.logoutUser(userId);

    res
      .status(logoutUserResponse.statusCode)
      .clearCookie(
        "accessToken",
        cookieOptions,
      )
      .clearCookie(
        "refreshToken",
        cookieOptions,
      )
      .send(logoutUserResponse);
  };
}

export const authController =
  new AuthController();
