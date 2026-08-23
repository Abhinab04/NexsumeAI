import { AuthRepository } from "@/api/auth/authRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { IUser } from "@/api/user/userModel";
import { AuthLoginSchema } from "./authModel";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { logger } from "@/server";
import { sendLoginTokenEmail } from "@/common/utils/email";

type AuthData = z.infer<typeof AuthLoginSchema>;

class AuthService {
  private authRepository: AuthRepository;

  constructor(repository: AuthRepository = new AuthRepository()) {
    this.authRepository = repository;
  }

  async loginUser(
    data: AuthData,
    userAgent: string,
  ): Promise<ServiceResponse<null>> {
    try {
      const user = await this.authRepository.createUser(data);
      if (!user) {
        return ServiceResponse.failure(
          "Login Failed",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      const loginToken = await this.authRepository.generateLoginToken(
        user._id as string,
      );
      if (!loginToken) {
        logger.error("Failed to genereate loginToken.");
        return ServiceResponse.failure(
          "Login Failed",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      const isLoginTokenEmailSend = await sendLoginTokenEmail(
        data.email,
        userAgent,
        loginToken,
      );
      if (isLoginTokenEmailSend == null) {
        return ServiceResponse.failure(
          "Login Failed",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      return ServiceResponse.success(
        "Please check you email to login",
        null,
        StatusCodes.OK,
      );
    } catch (err) {
      const errorMessage = `Error while logingin user with email ${data.email}:, ${(err as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Login Failed",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginWithToken(
    token: string,
  ): Promise<
    ServiceResponse<Pick<
      IUser,
      "email" | "accessToken" | "refreshToken"
    > | null>
  > {
    try {
      const loginToken = await this.authRepository.getLoginToken(token);

      if (!loginToken || loginToken.expire) {
        return ServiceResponse.failure(
          "Invalid Login Token",
          null,
          StatusCodes.BAD_REQUEST,
        );
      }

      const { email, accessToken, refreshToken } =
        await this.authRepository.generateRefreshTokenRefershToken(
          loginToken.userId as string,
        );

      if (email === null || accessToken == null || accessToken === null) {
        return ServiceResponse.failure(
          "Login Failed",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      const result = await this.authRepository.invalidateLoginToken(token);
      if (result === null) {
        return ServiceResponse.failure(
          "Login Failed",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      return ServiceResponse.success(
        "Login Successful",
        { email, accessToken, refreshToken },
        StatusCodes.OK,
      );
    } catch (err) {
      return ServiceResponse.failure(
        "Login Failed",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshAccessToken(incomingRefreshToken: string):Promise<
    ServiceResponse<Pick<
      IUser,
       "_id" | "email" | "accessToken" | "refreshToken"
    > | null>
  >  {
    try {
      const user = await this.authRepository.getUserFromRefreshToken(incomingRefreshToken);
      if(user === null) {
        return ServiceResponse.failure("Invalid RefreshToken", null, StatusCodes.UNAUTHORIZED);
      }
    
      const { _id, email, accessToken, refreshToken } =
        await this.authRepository.generateRefreshTokenRefershToken(
          user._id as string,
        );

      if (email === null || accessToken == null || accessToken === null) {
        return ServiceResponse.failure(
          "Login Failed",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }


      return ServiceResponse.success(
        "Access Token successfully updated",
        { _id, email, accessToken, refreshToken },
        StatusCodes.OK,
      );
    } catch(err) {
      console.log("Error: ", err);
      return ServiceResponse.failure("Failed to generate new RefreshToken", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async logoutUser(userId: string): Promise<ServiceResponse<Pick<IUser, "email"> | null>> {
    try {
      const user = await this.authRepository.revokeAccessToken(userId);
      if(user) {
        return ServiceResponse.success("Logout Successfully",{ email: user.email }, StatusCodes.OK);
      }
      return ServiceResponse.success("Logout Failed", null, StatusCodes.BAD_REQUEST);
    } catch (err) {
      logger.error(`Logout Error: ${err}`);
      return ServiceResponse.success("Logout Failed",null, StatusCodes.BAD_REQUEST);
    }
  }
}

export const authService = new AuthService();
