import jwt, { type SignOptions } from "jsonwebtoken";
import { Document, model, Schema } from "mongoose";

import { env } from "../../common/utils/env.js";

export interface IUser extends Document {
  email: string;
  accessToken?: string | null;
  refreshToken?: string | null;
}

export interface UserMethods {
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

const userMongooseSchema =
  new Schema<IUser & UserMethods>(
    {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
      },

      refreshToken: {
        type: String,
      },
    },
    {
      timestamps: true,
    },
  );

userMongooseSchema.methods.generateAccessToken =
  function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      } as object,

      env.ACCESS_TOKEN_SECRET,

      {
        expiresIn: env.ACCESS_TOKEN_EXPIRY,
      } as SignOptions,
    );
  };

userMongooseSchema.methods.generateRefreshToken =
  function () {
    return jwt.sign(
      {
        _id: this._id,
      } as object,

      env.REFRESH_TOKEN_SECRET,

      {
        expiresIn: env.REFRESH_TOKEN_EXPIRY,
      } as SignOptions,
    );
  };

const UserModel = model<IUser & UserMethods>(
  "User",
  userMongooseSchema,
);

export default UserModel;
