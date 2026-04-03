import { z } from "zod";
import { PaginationQuerySchema } from "./PaginationQuery.schema.js";

export const ProductQuerySchema = PaginationQuerySchema.extend({
  name: z.string().min(1).optional(),
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
}).refine(
  (data) =>
    data.minPrice == null ||
    data.maxPrice == null ||
    data.minPrice <= data.maxPrice,
  {
    message: "minPrice must be less than or equal to maxPrice",
    path: ["minPrice"],
  },
);

// Coerced output type — use this when reading validated values inside a handler.
export type ProductQueryType = z.infer<typeof ProductQuerySchema>;
