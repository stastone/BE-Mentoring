import type { NextFunction, Request, Response } from "express";

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
    return res.status(400).json({ data: null, message: "Invalid name" });
  }

  if (typeof price !== "number") {
    return res.status(400).json({ data: null, message: "Invalid price" });
  }

  if (typeof category !== "string") {
    return res.status(400).json({ data: null, message: "Invalid category" });
  }

  next();
};
