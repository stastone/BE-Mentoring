import type { RequestHandler } from "express";
import { UnauthorizedError } from "../types/Error.ts";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";

export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export const authenticateJWT: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    req.user = payload; // set proper user
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
