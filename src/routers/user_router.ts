import { Router } from "express";
import {
  createUserRequestHandler,
  getUserByIdRequestHandler,
  getUsersRequestHandler,
  updateUserEmailRequestHandler,
} from "../controllers/user_controller.ts";

const userRouter = Router();

userRouter
  .route("/:userId")
  .get(getUserByIdRequestHandler)
  .put(updateUserEmailRequestHandler);

userRouter
  .route("/")
  .get(getUsersRequestHandler)
  .post(createUserRequestHandler);

export default userRouter;
