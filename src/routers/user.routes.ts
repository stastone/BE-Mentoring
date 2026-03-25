import { Router } from "express";
import UserController from "../controllers/user/user.controller.js";
import { sqliteDataSource } from "../DataSource.js";
import UserService from "../services/user.service.js";
import type { User } from "../models/User.model.js";
import { restrictTo } from "../middlewares/restrictTo.js";
import { UpdateUserSchema } from "../schemas/User.schema.js";
import { validate } from "../middlewares/validateSchema.js";

const userRouter = Router();

const userRepository = sqliteDataSource.getRepository<User>("User");
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter
  .route("/:userId")
  .get(userController.getUserByIdRequestHandler)
  .patch(validate(UpdateUserSchema), userController.updateUserRequestHandler);

userRouter
  .route("/")
  .get(restrictTo(["admin"]), userController.getUsersRequestHandler);

export default userRouter;
