import { faker } from "@faker-js/faker";
import type { EntityManager } from "typeorm";
import { OrderItem } from "../../models/OrderItem.model.js";
import type { seedOrders } from "./order.seed.js";
import type { seedProducts } from "./product.seed.js";

type Orders = Awaited<ReturnType<typeof seedOrders>>;
type Products = Awaited<ReturnType<typeof seedProducts>>;

const ITEMS_PER_ORDER = 3;

export async function seedOrderItems(
  manager: EntityManager,
  orders: Orders,
  products: Products,
) {
  const items: OrderItem[] = [];

  for (const order of orders) {
    const selectedProducts = faker.helpers.arrayElements(
      products,
      ITEMS_PER_ORDER,
    );

    for (const product of selectedProducts) {
      const item = manager.create(OrderItem, {
        quantity: faker.number.int({ min: 1, max: 5 }),
        purchasePrice: product.price,
        productId: product.id,
        orderId: order.id,
      });
      await manager.save(OrderItem, item);
      items.push(item);
    }
  }

  return items;
}
