export abstract class BaseError extends Error {
  public readonly operational: boolean;
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    operational: boolean = true,
  ) {
    super(message);
    this.operational = operational;
    this.statusCode = statusCode;

    if (operational) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class InternalServerError extends BaseError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}
