import type { RequestHandler, RequestParamHandler } from "express";
import { ForbiddenError, UnauthorizedError } from "../types/Error.js";

export const restrictTo = <TParams, TRes, TReq, TQuery>(
  roles: ("user" | "admin")[],
): RequestHandler<TParams, TRes, TReq, TQuery> => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("User does not have permission");
    }

    next();
  };
};
