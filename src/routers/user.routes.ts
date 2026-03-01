import { Router } from "express";
import UserController from "../controllers/user/user.controller.js";
import dataSource from "../DataSource.js";
import UserService from "../services/user.service.js";
import type { User } from "../models/User.js";
import { restrictTo } from "../middlewares/restrictTo.js";

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
