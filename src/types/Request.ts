import type { Request as ERequest } from "express";

export type Request = ERequest & {
  user?: {
    id: string;
    role: "user" | "admin";
  };
};
