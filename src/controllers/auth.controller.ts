import type { RequestHandler, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../types/Error.ts";
import type { AuthService } from "../services/auth.service.ts";
import { BaseController } from "./base.controller.ts";
import { catchAsync } from "../utils/catchAsync.ts";

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
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({ success: true });
  }

  register: RequestHandler<
    null,
    unknown,
    { name: string; email: string; password: string }
  > = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new BadRequestError("Name, email, and password are required");
    }

    const user = await this._authService.register(name, email, password);

    this.created(res, { id: user.id, name: user.name, email: user.email });
  });

  login: RequestHandler<null, unknown, { email: string; password: string }> =
    catchAsync(async (req, res) => {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await this._authService.login(
        email,
        password,
      );
      this._sendTokenResponse(accessToken, refreshToken, res);
    });

  refresh: RequestHandler<null, unknown> = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new UnauthorizedError("Missing refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this._authService.rotateRefreshToken(refreshToken);
    this._sendTokenResponse(accessToken, newRefreshToken, res);
  });

  logout: RequestHandler<null, unknown> = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await this._authService.logout(refreshToken);
    }

    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ success: true, message: "Logged out" });
  });
}
