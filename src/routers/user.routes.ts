import { Router } from "express";
import UserController from "../controllers/user/user.controller.ts";
import dataSource from "../DataSource.ts";
import UserService from "../services/user.service.ts";
import type { User } from "../models/User.ts";
import { restrictTo } from "../middlewares/restrictTo.ts";

const userRouter = Router();

const userRepository = dataSource.getRepository<User>("User");
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter
  .route("/:userId")
  .get(userController.getUserByIdRequestHandler)
  .put(userController.updateUserRequestHandler);

userRouter
  .route("/")
  .get(restrictTo(["admin"]), userController.getUsersRequestHandler);

export default userRouter;
