import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../types/Error.js";
import type QueryString from "qs";

export const validate =
  <T>(schema: ZodType<T>, source: "body" | "query" = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(source === "query" ? req.query : req.body);

    if (!result.success) {
      throw new BadRequestError("Validation failed: " + result.error.message);
    }

    if (source === "query") {
      req.query = result.data as QueryString.ParsedQs;
    } else {
      req.body = result.data;
    }

    next();
  };
