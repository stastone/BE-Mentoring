import { type RequestHandler } from "express";
import { User } from "../models/User.ts";
import { type ResponsePayload } from "../types/ResponsePayload.ts";

type UserResponsePayload = ResponsePayload<User | User[]>;

export const getUsersRequestHandler: RequestHandler<
  null,
  UserResponsePayload,
  null
> = (_req, res) => {
  const users = User.getUsers();
  res
    .status(200)
    .json({ data: users, message: "Users retrieved successfully" });
};

export const getUserByIdRequestHandler: RequestHandler<
  { userId: string },
  UserResponsePayload,
  null
> = (req, res) => {
  const { userId } = req.params;
  const user = User.getUserById(parseInt(userId, 10));

  if (!user) {
    return res.status(404).json({ data: null, message: "User not found" });
  }

  res.status(200).json({ data: user, message: "User retrieved successfully" });
};

export const createUserRequestHandler: RequestHandler<
  null,
  UserResponsePayload,
  { name: string; email: string }
> = (req, res) => {
  console.log(req.body);
  const { name, email } = req.body;
  const newUser = User.createUser(name, email);
  res.status(201).json({ data: newUser, message: "User created successfully" });
};

export const updateUserEmailRequestHandler: RequestHandler<
  { userId: string },
  UserResponsePayload,
  { newEmail: string }
> = (req, res) => {
  const { userId } = req.params;
  const { newEmail } = req.body;
  const userToUpdate = User.getUserById(parseInt(userId, 10));

  if (!userToUpdate) {
    return res.status(404).json({ data: null, message: "User not found" });
  }

  userToUpdate.updateEmail(newEmail);
  res
    .status(200)
    .json({ data: userToUpdate, message: "User email updated successfully" });
};
