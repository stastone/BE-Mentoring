import type { User } from "../models/User.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
