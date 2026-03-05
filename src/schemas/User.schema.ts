import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["user", "admin"]),
  refreshToken: z.string().nullable(),
});

export const RegisterUserSchema = UserSchema.omit({
  id: true,
  refreshToken: true,
});

export const LoginUserSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type UserType = z.infer<typeof UserSchema>;
