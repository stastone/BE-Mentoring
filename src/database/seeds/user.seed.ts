import bcrypt from "bcrypt";
import type { EntityManager } from "typeorm";
import { User } from "../../models/User.model.js";

export async function seedUsers(manager: EntityManager) {
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const userPassword = await bcrypt.hash("user1234", 10);

  const admin = manager.create(User, {
    name: "Admin User",
    email: "admin@example.com",
    password: adminPassword,
    role: "admin",
  });
  await manager.save(User, admin);

  const alice = manager.create(User, {
    name: "Alice Smith",
    email: "alice@example.com",
    password: userPassword,
    role: "user",
  });
  await manager.save(User, alice);

  const bob = manager.create(User, {
    name: "Bob Jones",
    email: "bob@example.com",
    password: userPassword,
    role: "user",
  });
  await manager.save(User, bob);

  return { admin, alice, bob };
}
