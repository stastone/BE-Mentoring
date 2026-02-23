import type { RequestHandler, Response } from "express";
import { BadRequestError } from "../types/Error.ts";
import type { AuthService } from "../services/auth.service.ts";
import { BaseController } from "../utils/BaseController.ts";

export class AuthController extends BaseController {
  private readonly _authService: AuthService;
  constructor(authService: AuthService) {
    super();
    this._authService = authService;
  }

  private _sendTokenResponse(
    accessToken: string,
    refreshToken: string,
    res: Response,
  ) {
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: "strict",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "strict",
      })
      .json({ success: true });
  }

  register: RequestHandler<
    null,
    unknown,
    { name: string; email: string; password: string }
  > = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new BadRequestError("Name, email, and password are required");
    }

    const existing = await this._authService.register(name, email, password);
    if (existing) {
      throw new BadRequestError("Email already registered");
    }

    const user = await this._authService.register(name, email, password);

    this.created(res, { id: user.id, name: user.name, email: user.email });
  };

  login: RequestHandler<null, unknown, { email: string; password: string }> =
    async (req, res) => {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await this._authService.login(
        email,
        password,
      );
      this._sendTokenResponse(accessToken, refreshToken, res);
    };

  refresh: RequestHandler<null, unknown, { refreshToken: string }> = async (
    req,
    res,
  ) => {
    const { refreshToken } = req.body;
    const { accessToken, refreshToken: newRefreshToken } =
      await this._authService.rotateRefreshToken(refreshToken);
    this._sendTokenResponse(accessToken, newRefreshToken, res);
  };

  logout: RequestHandler<null, unknown, { refreshToken: string }> = async (
    req,
    res,
  ) => {
    const { refreshToken } = req.body;
    await this._authService.logout(refreshToken);

    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ success: true, message: "Logged out" });
  };
}
