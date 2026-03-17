import type { EntityManager } from "typeorm";
import { Category } from "../../models/Category.model.js";

export async function seedCategories(manager: EntityManager) {
  const electronics = manager.create(Category, {
    name: "Electronics",
    parentCategoryId: null,
  });
  await manager.save(Category, electronics);

  const clothing = manager.create(Category, {
    name: "Clothing",
    parentCategoryId: null,
  });
  await manager.save(Category, clothing);

  const phones = manager.create(Category, {
    name: "Phones",
    parentCategoryId: electronics.id,
  });
  await manager.save(Category, phones);

  const laptops = manager.create(Category, {
    name: "Laptops",
    parentCategoryId: electronics.id,
  });
  await manager.save(Category, laptops);

  const tshirts = manager.create(Category, {
    name: "T-Shirts",
    parentCategoryId: clothing.id,
  });
  await manager.save(Category, tshirts);

  return { electronics, clothing, phones, laptops, tshirts };
}
