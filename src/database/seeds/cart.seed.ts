import { faker } from "@faker-js/faker";
import type { EntityManager } from "typeorm";
import { Cart, CartItem } from "../../models/Cart.model.js";
import type { seedUsers } from "./user.seed.js";
import type { seedProducts } from "./product.seed.js";

type Users = Awaited<ReturnType<typeof seedUsers>>;
type Products = Awaited<ReturnType<typeof seedProducts>>;

const CART_ITEMS = 4;

export async function seedCarts(
  manager: EntityManager,
  users: Users,
  products: Products,
) {
  const allUsers = [users.admin, ...users.users];

  for (const user of allUsers) {
    const itemCount = faker.number.int({ min: 1, max: CART_ITEMS });
    const selectedProducts = faker.helpers.arrayElements(products, itemCount);

    const items: CartItem[] = selectedProducts.map((product) => {
      const item = new CartItem();
      item.productId = String(product.id);
      item.quantity = faker.number.int({ min: 1, max: 5 });
      item.addedAt = faker.date.recent({ days: 30 });
      return item;
    });

    const cart = manager.create(Cart, {
      userId: String(user.id),
      items,
      updatedAt: new Date(),
    });

    await manager.save(Cart, cart);
  }
}
