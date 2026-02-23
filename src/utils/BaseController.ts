import type { Response } from "express";

export interface ResponsePayload<T> {
  data: T | null;
  message?: string;
  success: boolean;
}

export abstract class BaseController {
  protected ok<T>(res: Response<ResponsePayload<T>>, data: T): void {
    res.status(200).json({ data, message: "Success", success: true });
  }

  protected created<T>(res: Response<ResponsePayload<T>>, data: T): void {
    res.status(201).json({ data, message: "Created", success: true });
  }

  protected badRequest<T>(
    res: Response<ResponsePayload<T>>,
    message: string,
  ): void {
    res.status(400).json({ data: null, message, success: false });
  }

  protected notFound<T>(
    res: Response<ResponsePayload<T>>,
    message: string,
  ): void {
    res.status(404).json({ data: null, message, success: false });
  }
}
