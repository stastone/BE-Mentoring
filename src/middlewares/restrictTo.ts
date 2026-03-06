import type { NextFunction } from "express";
import type { Request } from "../types/Request.js";
import { ForbiddenError, UnauthorizedError } from "../types/Error.js";

export const restrictTo = <TRes, TReq extends Request>(
  roles: ("user" | "admin")[],
) => {
  return (req: TReq, _res: TRes, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("User does not have permission");
    }

    next();
  };
};
