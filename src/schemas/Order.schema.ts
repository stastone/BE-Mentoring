import z from "zod";

const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum(["pending", "completed", "cancelled"]),
});

const OrderItemSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const CreateOrderSchema = z.object({
  userId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    }),
  ),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["pending", "completed", "cancelled"]),
});

export const UpdateOrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export type OrderType = z.infer<typeof OrderSchema>;

export type OrderItemType = z.infer<typeof OrderItemSchema>;
