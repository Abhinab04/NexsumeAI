import { z } from "zod";
import mongoose, { Document, model, Schema } from "mongoose";
import { IUser } from "../user/userModel";
import { email } from "zod/v4/core/regexes.cjs";

export const AuthLoginSchema = z.object({
  email: z.email(),
});

export interface IToken extends Document {
  userId: IUser["_id"];
  token: string;
  expire: boolean;
}

const loginTokenMongooseScheme = new Schema<IToken>(
  {
    userId: {
      type: Schema.ObjectId,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    expire: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const LoginTokenModel = model("LoginToken", loginTokenMongooseScheme);
export default LoginTokenModel;
