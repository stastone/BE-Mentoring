import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../types/Error.ts";

export const productPayloadValidator = (
  req: Request<
    { productId: string } | null,
    null,
    { name: string; price: number; description?: string; category: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  const { name, price, category } = req.body;

  if (typeof name !== "string") {
    throw new BadRequestError("Invalid name");
  }

  if (typeof price !== "number") {
    throw new BadRequestError("Invalid price");
  }

  if (typeof category !== "string") {
    throw new BadRequestError("Invalid category");
  }

  next();
};
