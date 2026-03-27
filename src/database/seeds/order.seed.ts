import { faker } from "@faker-js/faker";
import type { EntityManager } from "typeorm";
import { Order } from "../../models/Order.model.js";
import type { seedUsers } from "./user.seed.js";

type Users = Awaited<ReturnType<typeof seedUsers>>;

const ORDERS = 3;
const ORDER_STATUSES = ["pending", "completed", "cancelled"] as const;

export async function seedOrders(manager: EntityManager, users: Users) {
  const orders: Order[] = [];

  for (const user of users.users) {
    for (let i = 0; i < ORDERS; i++) {
      const order = manager.create(Order, {
        status: faker.helpers.arrayElement(ORDER_STATUSES),
        userId: user.id,
      });
      await manager.save(Order, order);
      orders.push(order);
    }
  }

  return orders;
}
