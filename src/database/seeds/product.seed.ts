import type { EntityManager } from "typeorm";
import { Product } from "../../models/Product.model.js";
import type { seedCategories } from "./category.seed.js";

type Categories = Awaited<ReturnType<typeof seedCategories>>;

export async function seedProducts(
  manager: EntityManager,
  categories: Categories,
) {
  const { phones, laptops, tshirts } = categories;

  const iphone = manager.create(Product, {
    name: "iPhone 15",
    price: 999,
    description: "Latest Apple smartphone with A17 chip.",
    categoryId: phones.id,
    category: phones,
  });
  await manager.save(Product, iphone);

  const samsung = manager.create(Product, {
    name: "Samsung Galaxy S24",
    price: 849,
    description: "Flagship Android phone with AI features.",
    categoryId: phones.id,
    category: phones,
  });
  await manager.save(Product, samsung);

  const macbook = manager.create(Product, {
    name: 'MacBook Pro 14"',
    price: 1999,
    description: "Powerful laptop with M3 Pro chip.",
    categoryId: laptops.id,
    category: laptops,
  });
  await manager.save(Product, macbook);

  const dellXps = manager.create(Product, {
    name: "Dell XPS 15",
    price: 1499,
    description: "High-performance Windows laptop with OLED display.",
    categoryId: laptops.id,
    category: laptops,
  });
  await manager.save(Product, dellXps);

  const tshirt = manager.create(Product, {
    name: "Classic White Tee",
    price: 29,
    description: "100% organic cotton t-shirt.",
    categoryId: tshirts.id,
    category: tshirts,
  });
  await manager.save(Product, tshirt);

  return { iphone, samsung, macbook, dellXps, tshirt };
}
