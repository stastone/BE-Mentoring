import type { EntityManager } from "typeorm";
import { Order } from "../../models/Order.model.js";
import type { seedUsers } from "./user.seed.js";

type Users = Awaited<ReturnType<typeof seedUsers>>;

export async function seedOrders(manager: EntityManager, users: Users) {
  const { alice, bob } = users;

  const aliceOrder = manager.create(Order, {
    status: "completed",
    userId: alice.id,
  });
  await manager.save(Order, aliceOrder);

  const bobOrder = manager.create(Order, {
    status: "pending",
    userId: bob.id,
  });
  await manager.save(Order, bobOrder);

  return { aliceOrder, bobOrder };
}
