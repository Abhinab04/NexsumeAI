import UserModel, { type IUser } from "./userModel.js";
export class UserRepository {
  async getUserById(userId: string): Promise<IUser | null> {
    const user = await UserModel.findById(userId);
    return user || null;
  }
}
