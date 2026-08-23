import { Request, RequestHandler, Response } from "express";
import { userService } from "./userService";
import { StatusCodes } from "http-status-codes";

class UserController {
  public getLoggedinUser: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user?._id;
    if (userId) {
      const getloggedinUserResponse = await userService.getLoggedinUser(userId as string);
      res.status(getloggedinUserResponse.statusCode).send(getloggedinUserResponse);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
    }
  };
}

export const userController = new UserController();
