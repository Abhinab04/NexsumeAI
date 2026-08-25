import type { IUser } from "../api/user/userModel.js";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<IUser, "refreshToken"> | null;
    }
  }
}

export {};
