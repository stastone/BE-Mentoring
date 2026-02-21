import { Router } from "express";
import UserController from "../controllers/user_controller.ts";
import UserRepositoryService from "../services/user_repository.service.ts";
import UserService from "../services/user.service.ts";

const userRouter = Router();

const userRepository = new UserRepositoryService("./src/mocks/users.json");
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter
  .route("/:userId")
  .get(userController.getUserByIdRequestHandler)
  .put(userController.updateUserRequestHandler)
  .delete(userController.deleteUserRequestHandler);

userRouter
  .route("/")
  .get(userController.getUsersRequestHandler)
  .post(userController.createUserRequestHandler);

export default userRouter;
