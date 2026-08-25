import { StatusCodes } from "http-status-codes";

import { UserRepository } from "./userRepository.js";
import { IUser } from "./userModel.js";

import { ServiceResponse } from "../../common/models/serviceResponse.js";
import { logger } from "../../server.js";

class UserService {
  private userRepository: UserRepository;

  constructor(
    repository: UserRepository = new UserRepository(),
  ) {
    this.userRepository = repository;
  }

  async getLoggedinUser(
    userId: string,
  ): Promise<ServiceResponse<IUser | null>> {
    try {
      const user =
        await this.userRepository.getUserById(userId);

      if (user) {
        return ServiceResponse.success(
          "Loggedin User",
          user,
          StatusCodes.OK,
        );
      }

      return ServiceResponse.failure(
        "Failed to get Loggedin User",
        null,
        StatusCodes.BAD_REQUEST,
      );
    } catch (err) {
      logger.info(
        `Error while getting loggedin user, Error: ${err}`,
      );

      return ServiceResponse.failure(
        "Failed to get Loggedin User",
        null,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export const userService = new UserService();
