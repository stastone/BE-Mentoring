import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { InternalServerError } from "../types/Error.js";

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new InternalServerError(
        "Validation failed: " + result.error.message,
      );
    }

    req.body = result.data;
    next();
  };
