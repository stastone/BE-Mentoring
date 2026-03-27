import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import type { EntityManager } from "typeorm";
import { User } from "../../models/User.model.js";

const USERS = 10;

export async function seedUsers(manager: EntityManager) {
  const hashedPassword = await bcrypt.hash("user1234", 10);

  const admin = manager.create(User, {
    name: "Admin User",
    email: "admin@example.com",
    password: await bcrypt.hash("admin1234", 10),
    role: "admin",
  });
  await manager.save(User, admin);

  const users: User[] = [];
  for (let i = 0; i < USERS; i++) {
    const user = manager.create(User, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: "user",
    });
    await manager.save(User, user);
    users.push(user);
  }

  return { admin, users };
}
