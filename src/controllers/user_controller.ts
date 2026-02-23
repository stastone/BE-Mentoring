import { type RequestHandler } from "express";
import { User } from "../models/User.ts";
import type UserService from "../services/user/user.service.ts";
import {
  BaseController,
  type ResponsePayload,
} from "../utils/BaseController.ts";

export default class UserController extends BaseController {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    super();
    this.userService = userService;
  }

  getUsersRequestHandler: RequestHandler<null, ResponsePayload<User[]>, null> =
    (_req, res) => {
      const users = this.userService.getUsers();

      this.ok(res, users);
    };

  getUserByIdRequestHandler: RequestHandler<
    { userId: string },
    ResponsePayload<User>,
    null
  > = (req, res) => {
    const { userId } = req.params;
    const user = this.userService.getUserById(parseInt(userId, 10));

    if (!user) {
      return this.notFound(res, "User not found");
    }

    this.ok(res, user);
  };

  createUserRequestHandler: RequestHandler<
    null,
    ResponsePayload<User>,
    { name: string; email: string }
  > = (req, res) => {
    const { name, email } = req.body;
    const newUser = this.userService.createUser(name, email);

    this.created(res, newUser);
  };

  updateUserRequestHandler: RequestHandler<
    { userId: string },
    ResponsePayload<User>,
    { newEmail?: string; newName?: string }
  > = (req, res) => {
    const { userId } = req.params;
    const { newEmail, newName } = req.body;
    const userToUpdate = this.userService.getUserById(parseInt(userId, 10));

    if (!userToUpdate) {
      return this.notFound(res, "User not found");
    }

    const updatedUser = this.userService.updateUser(
      userToUpdate.id,
      newName ?? userToUpdate.name,
      newEmail ?? userToUpdate.email,
    );

    this.ok(res, updatedUser);
  };

  deleteUserRequestHandler: RequestHandler<
    { userId: string },
    ResponsePayload<null>,
    null
  > = (req, res) => {
    const { userId } = req.params;
    const userToDelete = this.userService.getUserById(parseInt(userId, 10));

    if (!userToDelete) {
      return this.notFound(res, "User not found");
    }

    this.userService.deleteUser(userToDelete.id);

    this.ok(res, null);
  };
}
