import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Repository } from "typeorm";
import type { User } from "../models/User.ts";
import { UnauthorizedError, BadRequestError } from "../types/Error.ts";
import {
  signAccessToken,
  signRefreshToken,
  setTokens,
} from "../utils/jwtUtils.ts";
import type { JwtPayload } from "../middlewares/authenticateJWT.ts";

export class AuthService {
  private readonly _userRepository: Repository<User>;
  constructor(userRepository: Repository<User>) {
    this._userRepository = userRepository;
  }

  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new BadRequestError("Name, email, and password are required");
    }

    const existing = await this._userRepository.findOneBy({ email });
    if (existing) {
      throw new BadRequestError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this._userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await this._userRepository.save(user);

    return user;
  }

  async login(email: string, password: string) {
    const user = await this._userRepository.findOneBy({ email });
    if (!user || !user.password) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const tokens = setTokens(user);
    await this._userRepository.save(user);

    return { user, ...tokens };
  }

  private async verifyToken(token: string, type: "access" | "refresh") {
    try {
      if (type === "access") {
        return jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET || "access_secret",
        ) as JwtPayload;
      } else {
        return jwt.verify(
          token,
          process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
        ) as JwtPayload;
      }
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }

  async rotateRefreshToken(refreshToken: string) {
    const payload = await this.verifyToken(refreshToken, "refresh");
    const user = await this._userRepository.findOneBy({ id: payload.userId });
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const newAccessToken = signAccessToken(user.id);
    const newRefreshToken = signRefreshToken(user.id);

    user.refreshToken = newRefreshToken;
    await this._userRepository.save(user);

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const payload = await this.verifyToken(refreshToken, "refresh");
    const user = await this._userRepository.findOneBy({ id: payload.userId });

    if (user) {
      user.refreshToken = undefined;
      await this._userRepository.save(user);
    }

    return true;
  }
}
