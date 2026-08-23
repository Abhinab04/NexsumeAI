import UserModel, { IUser } from "./userModel";

export class UserRepository {
  async getUserById(userId: string): Promise<IUser | null> {
    const user = await UserModel.findById(userId);
    return user || null;
  }
}
