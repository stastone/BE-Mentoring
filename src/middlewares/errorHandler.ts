import type { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../types/Error.ts";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ success: false, message: err.message });
  }

  if (err instanceof BadRequestError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ success: false, message: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({ success: false, message: err.message });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
