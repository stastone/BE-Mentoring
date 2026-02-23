import type { NextFunction, Request, Response } from "express";

export const validateProductPayload = (
  req: Request<
    { productId: string } | null,
    null,
    { name: string; price: number; description?: string; category: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  const { name, price, category } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ data: null, message: "Invalid name" });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ data: null, message: "Invalid price" });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({ data: null, message: "Invalid category" });
  }

  next();
};
