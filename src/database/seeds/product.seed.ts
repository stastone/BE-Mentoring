import { faker } from "@faker-js/faker";
import type { EntityManager } from "typeorm";
import { Product } from "../../models/Product.model.js";
import type { seedCategories } from "./category.seed.js";

type Categories = Awaited<ReturnType<typeof seedCategories>>;

const PRODUCTS = 5;

export async function seedProducts(
  manager: EntityManager,
  categories: Categories,
) {
  const leafCategories = [
    categories.phones,
    categories.laptops,
    categories.tshirts,
  ];

  const products: Product[] = [];

  for (const category of leafCategories) {
    for (let i = 0; i < PRODUCTS; i++) {
      const product = manager.create(Product, {
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price({ min: 10, max: 2000 })),
        description: faker.commerce.productDescription(),
        categoryId: category.id,
        category,
      });
      await manager.save(Product, product);
      products.push(product);
    }
  }

  return products;
}
