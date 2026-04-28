import type { Request, Response, NextFunction } from "express";
import { BaseError } from "../../src/types/Error.js";

export const brokerErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof BaseError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  console.error("broker unexpected error:", err);
  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
};
