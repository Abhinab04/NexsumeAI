import { IUser } from "@/api/user/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<IUser, "refreshToken"> | null;
    }
  }
}
