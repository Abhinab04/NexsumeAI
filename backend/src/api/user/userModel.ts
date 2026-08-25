import UserModel, { type IUser } from "./userModel.js";

export class UserRepository {
  async getUserById(
    userId: string,
  ): Promise<IUser | null> {
    try {
      const user =
        await UserModel.findById(userId).exec();

      return user;
    } catch (err) {
      console.error(
        `Error while getting user by ID: ${err}`,
      );

      return null;
    }
  }
}
