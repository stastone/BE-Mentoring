import { z } from "zod";

export const UserPreferencesQuerySchema = z.object({
  userId: z.string().min(1).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type UserPreferencesQueryType = z.infer<
  typeof UserPreferencesQuerySchema
>;
