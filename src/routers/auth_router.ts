import { Router } from "express";
import dataSource from "../DataSource.ts";
import { AuthController } from "../controllers/auth_controller.ts";
import type { User } from "../models/User.ts";
import { AuthService } from "../services/auth.service.ts";

const userRepository = dataSource.getRepository<User>("User");
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

export default authRouter;
