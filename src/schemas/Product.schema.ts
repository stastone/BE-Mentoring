import z from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional().nullable(),
  category: z.string().min(1),
});

export const CreateProductSchema = ProductSchema.omit({ id: true });

export const UpdateProductSchema = CreateProductSchema.partial();

export type ProductType = z.infer<typeof ProductSchema>;
