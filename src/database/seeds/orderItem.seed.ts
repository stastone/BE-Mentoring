import type { EntityManager } from "typeorm";
import { OrderItem } from "../../models/OrderItem.model.js";
import type { seedOrders } from "./order.seed.js";
import type { seedProducts } from "./product.seed.js";

type Orders = Awaited<ReturnType<typeof seedOrders>>;
type Products = Awaited<ReturnType<typeof seedProducts>>;

export async function seedOrderItems(
  manager: EntityManager,
  orders: Orders,
  products: Products,
) {
  const { aliceOrder, bobOrder } = orders;
  const { iphone, tshirt, macbook } = products;

  const aliceItem1 = manager.create(OrderItem, {
    quantity: 1,
    purchasePrice: iphone.price,
    productId: iphone.id,
    orderId: aliceOrder.id,
  });
  await manager.save(OrderItem, aliceItem1);

  const aliceItem2 = manager.create(OrderItem, {
    quantity: 2,
    purchasePrice: tshirt.price,
    productId: tshirt.id,
    orderId: aliceOrder.id,
  });
  await manager.save(OrderItem, aliceItem2);

  const bobItem1 = manager.create(OrderItem, {
    quantity: 1,
    purchasePrice: macbook.price,
    productId: macbook.id,
    orderId: bobOrder.id,
  });
  await manager.save(OrderItem, bobItem1);

  return { aliceItem1, aliceItem2, bobItem1 };
}
