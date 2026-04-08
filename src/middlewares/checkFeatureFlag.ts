import type { NextFunction, Request, Response } from "express";
import type { MongoRepository } from "typeorm";
import { FeatureFlag } from "../models/FeatureFlag.model.js";
import { NotFoundError } from "../types/Error.js";

export const checkFeatureFlag =
  (repo: MongoRepository<FeatureFlag>, flagName: string) =>
  async <TRes, TReq extends Request>(
    _req: TReq,
    _res: TRes,
    next: NextFunction,
  ) => {
    const flag = await repo.findOne({ where: { name: flagName } });

    if (!flag || !flag.enabled) {
      throw new NotFoundError("Not found");
    }

    next();
  };
