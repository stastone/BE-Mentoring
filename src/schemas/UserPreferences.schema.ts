import { z } from "zod";

export const PreferenceSchema = z.object({
  productId: z.string(),
  purchaseCount: z.number(),
  totalQuantityBought: z.number(),
  maxWishlistPriority: z.number(),
  wasWishlisted: z.boolean(),
  preferenceScore: z.number(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string(),
  preferences: z.array(PreferenceSchema),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type Preference = z.infer<typeof PreferenceSchema>;
