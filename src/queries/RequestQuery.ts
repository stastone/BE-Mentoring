import { BadRequestError } from "../types/Error.js";

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export abstract class RequestQuery<TFilters extends object> {
  protected readonly _query: Record<string, unknown>;

  constructor(query: Record<string, unknown>) {
    this._query = query;
  }

  protected getStringParam(key: string): string {
    const value = this._query[key];

    if (typeof value !== "string") {
      throw new BadRequestError(
        `Expected query parameter "${key}" to be a string`,
      );
    }

    const trimmed = value.trim();
    if (!trimmed.length) {
      throw new BadRequestError(`Query parameter "${key}" cannot be empty`);
    }

    return trimmed;
  }

  protected getNumberParam(key: string): number | undefined {
    const value = this._query[key];

    if (typeof value !== "string") {
      return undefined;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new BadRequestError(
        `Query parameter "${key}" must be a valid number`,
      );
    }

    return parsed;
  }

  private getPositiveIntParam(key: string): number | undefined {
    const value = this.getNumberParam(key);

    if (!value || !Number.isInteger(value) || value <= 0) {
      throw new BadRequestError(
        `Query parameter "${key}" must be a valid positive integer`,
      );
    }

    return value;
  }

  public getPagination(defaultLimit = 10, maxLimit = 100): PaginationQuery {
    const page = this.getPositiveIntParam("page") ?? 1;
    const requestedLimit = this.getPositiveIntParam("limit") ?? defaultLimit;
    const limit = Math.min(requestedLimit, maxLimit);

    return {
      page,
      limit,
      skip: (page - 1) * limit,
    };
  }

  public abstract getFilters(): TFilters;
}
