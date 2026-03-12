import { z } from "zod";

const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  parentCategoryId: z.string().nullable(),
});

export type CategoryType = z.infer<typeof CategorySchema>;
