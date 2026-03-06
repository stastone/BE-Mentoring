import { Router } from "express";
import dataSource from "../DataSource.js";
import AuthController from "../controllers/auth/auth.controller.js";
import type { User } from "../models/User.model.js";
import AuthService from "../services/auth.service.js";
import { validate } from "../middlewares/validateSchema.js";
import { RegisterUserSchema, LoginUserSchema } from "../schemas/User.schema.js";

const userRepository = dataSource.getRepository<User>("User");
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post(
  "/register",
  validate(RegisterUserSchema),
  authController.register,
);
authRouter.post("/login", validate(LoginUserSchema), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

export default authRouter;
