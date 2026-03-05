import z from "zod";

export const ReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().min(1),
});

export const CreateReviewSchema = ReviewSchema.omit({ id: true });

export type ReviewType = z.infer<typeof ReviewSchema>;
