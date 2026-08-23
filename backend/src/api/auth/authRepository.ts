import UserModel, { IUser } from "@/api/user/userModel";
import LoginTokenModel, { AuthLoginSchema, IToken } from "@/api/auth/authModel";
import { logger } from "@/server";
import jwt from "jsonwebtoken";
import { env } from "@/common/utils/env";

export class AuthRepository {
  async createUser(data: unknown): Promise<IUser | null> {
    const parsed = AuthLoginSchema.safeParse(data);
    if (!parsed.success) {
      return null;
    }

    try {
      const { email } = parsed.data;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return existingUser;
      }

      const newUser = await UserModel.create({ email });
      return newUser;
    } catch (err) {
      logger.error(`Query Failed: ${err}`);
      return null;
    }
  }

  async generateLoginToken(userId: string): Promise<string | null> {
    try {
      const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "20m" });
      await LoginTokenModel.create({ userId, token });
      return token;
    } catch (err) {
      logger.error(`Error while generating Login Token: ${err}`);
      return null;
    }
  }

  async getLoginToken(jwtToken: string): Promise<IToken | null> {
    try {
      jwt.verify(jwtToken, env.JWT_SECRET);

      const token = await LoginTokenModel.findOne({ token: jwtToken });

      if (!token) {
        logger.warn(`Login token not found: ${jwtToken}`);
        return null;
      }

      return token;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        logger.warn(`Login token expired: ${jwtToken}`);
        return null;
      }
      logger.error(`Error while getting LoginToken: ${(err as Error).message}`);
      return null;
    }
  }

  async invalidateLoginToken(jwtToken: string): Promise<IToken | null> {
    return (
      (await LoginTokenModel.findOneAndUpdate(
        { token: jwtToken },
        { $set: { expire: true } },
        { new: true },
      )) || null
    );
  }

  async generateRefreshTokenRefershToken(userId: string): Promise<{
    _id: string | null,
    email: string | null;
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    try {
      const user = await UserModel.findById(userId);
      if (user != null) {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { _id: user._id as string, email: user.email, accessToken, refreshToken };
      }
      logger.info("Failed to generate Access Token & Refresh Token");
      return {
        _id: null,
        email: null,
        accessToken: null,
        refreshToken: null,
      };
    } catch (err) {
      logger.info(
        `Error while generating Access Token & Refresh Token, Error: ${err}`,
      );
      return {
        _id: null,
        email: null,
        accessToken: null,
        refreshToken: null,
      };
    }
  }

  async getUserFromRefreshToken(incomingRefreshToken: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(
        incomingRefreshToken,
        env.REFRESH_TOKEN_SECRET
      );

      const { _id } = decoded as jwt.JwtPayload & { userId: string };
      const user = await UserModel.findById(_id).exec(); 
      return user;
    } catch (err) {
      console.log("Error: ",err);
      if (err instanceof jwt.TokenExpiredError) {
        logger.error(`Refresh Token Expired: ${incomingRefreshToken}`);
      } else {
        logger.error(`Invalid Refresh Token: ${(err as Error).message}`);
      }
      return null;
    }
  }

  async revokeAccessToken(userId: string):Promise<IUser | null> {
    const newUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1
        }
      },
      {
        new: true
      }
    )

    return newUser || null;
  }
}
