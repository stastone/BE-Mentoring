import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Repository } from "typeorm";
import type { User } from "../models/User.js";
import { UnauthorizedError, BadRequestError } from "../types/Error.js";
import { signAccessToken, signRefreshToken } from "../utils/jwtUtils.js";
import type { JwtPayload } from "../middlewares/authenticateJWT.js";

class AuthService {
  private readonly _userRepository: Repository<User>;
  constructor(userRepository: Repository<User>) {
    this._userRepository = userRepository;
  }

  public register = async (name: string, email: string, password: string) => {
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
  };

  public login = async (email: string, password: string) => {
    const user = await this._userRepository.findOneBy({ email });
    if (!user || !user.password) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await this._userRepository.save(user);

    return { user, accessToken, refreshToken };
  };

  public rotateRefreshToken = async (refreshToken: string) => {
    const payload = await this.verifyToken(refreshToken, "refresh");
    const user = await this._userRepository.findOneBy({ id: payload.userId });
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const newAccessToken = signAccessToken(user.id, user.role);
    const newRefreshToken = signRefreshToken(user.id);

    user.refreshToken = newRefreshToken;
    await this._userRepository.save(user);

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  };

  public logout = async (refreshToken: string) => {
    const payload = await this.verifyToken(refreshToken, "refresh");
    const user = await this._userRepository.findOneBy({ id: payload.userId });

    if (user && user.refreshToken === refreshToken) {
      user.refreshToken = undefined;
      await this._userRepository.save(user);
    }

    return true;
  };

  private verifyToken = async (token: string, type: "access" | "refresh") => {
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
  };
}

export default AuthService;
