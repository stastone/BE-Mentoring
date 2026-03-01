import { type RequestHandler } from "express";
import type { User } from "../../models/User.ts";
import type UserService from "../../services/user.service.ts";
import { BaseController, type ResponsePayload } from "../base.controller.ts";
import { catchAsync } from "../../utils/catchAsync.ts";

class UserController extends BaseController {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    super();
    this.userService = userService;
  }

  getUsersRequestHandler: RequestHandler<never, ResponsePayload<User[]>, null> =
    catchAsync(async (_req, res) => {
      const users = await this.userService.getUsers();

      this.ok(res, users);
    });

  getUserByIdRequestHandler: RequestHandler<
    { userId: string },
    ResponsePayload<User>,
    null
  > = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await this.userService.getUserById(parseInt(userId, 10));

    this.ok(res, user);
  });

  updateUserRequestHandler: RequestHandler<
    { userId: string },
    ResponsePayload<User>,
    { newEmail?: string; newName?: string }
  > = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { newEmail, newName } = req.body;

    const userToUpdate = await this.userService.getUserById(
      parseInt(userId, 10),
    );

    const updatedUser = await this.userService.updateUser(
      userToUpdate.id,
      newName ?? userToUpdate.name,
      newEmail ?? userToUpdate.email,
    );

    this.ok(res, updatedUser);
  });
}

export default UserController;
