import { type RequestHandler } from "express";
import { User } from "../models/User.ts";
import { type ResponsePayload } from "../types/ResponsePayload.ts";
import type UserService from "../services/user.service.ts";

type UserResponsePayload = ResponsePayload<User | User[]>;

export default class UserController {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUsersRequestHandler: RequestHandler<null, UserResponsePayload, null> = (
    _req,
    res,
  ) => {
    const users = this.userService.getUsers();
    res
      .status(200)
      .json({ data: users, message: "Users retrieved successfully" });
  };

  getUserByIdRequestHandler: RequestHandler<
    { userId: string },
    UserResponsePayload,
    null
  > = (req, res) => {
    const { userId } = req.params;
    const user = this.userService.getUserById(parseInt(userId, 10));

    if (!user) {
      return res.status(404).json({ data: null, message: "User not found" });
    }

    res
      .status(200)
      .json({ data: user, message: "User retrieved successfully" });
  };

  createUserRequestHandler: RequestHandler<
    null,
    UserResponsePayload,
    { name: string; email: string }
  > = (req, res) => {
    console.log(req.body);
    const { name, email } = req.body;
    const newUser = this.userService.createUser(name, email);
    res
      .status(201)
      .json({ data: newUser, message: "User created successfully" });
  };

  updateUserEmailRequestHandler: RequestHandler<
    { userId: string },
    UserResponsePayload,
    { newEmail: string }
  > = (req, res) => {
    const { userId } = req.params;
    const { newEmail } = req.body;
    const userToUpdate = this.userService.getUserById(parseInt(userId, 10));

    if (!userToUpdate) {
      return res.status(404).json({ data: null, message: "User not found" });
    }

    const updatedUser = this.userService.updateUser(
      userToUpdate.id,
      userToUpdate.name,
      newEmail,
    );
    res
      .status(200)
      .json({ data: updatedUser, message: "User email updated successfully" });
  };
}
