import dataSource from "../DataSource.js";
import { Category } from "../models/Category.model.js";
import { User } from "../models/User.model.js";
import { Product } from "../models/Product.model.js";
import { Order } from "../models/Order.model.js";
import { OrderItem } from "../models/OrderItem.model.js";
import { Review } from "../models/Review.model.js";
import { seedCategories } from "./seeds/category.seed.js";
import { seedUsers } from "./seeds/user.seed.js";
import { seedProducts } from "./seeds/product.seed.js";
import { seedOrders } from "./seeds/order.seed.js";
import { seedOrderItems } from "./seeds/orderItem.seed.js";
import { seedReviews } from "./seeds/review.seed.js";

async function seed() {
  await dataSource.initialize();

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.manager.clear(Review);
    await queryRunner.manager.clear(OrderItem);
    await queryRunner.manager.clear(Order);
    await queryRunner.manager.clear(Product);
    await queryRunner.manager.clear(Category);
    await queryRunner.manager.clear(User);

    const categories = await seedCategories(queryRunner.manager);
    const users = await seedUsers(queryRunner.manager);
    const products = await seedProducts(queryRunner.manager, categories);
    const orders = await seedOrders(queryRunner.manager, users);
    await seedOrderItems(queryRunner.manager, orders, products);
    await seedReviews(queryRunner.manager, users, products);

    await queryRunner.commitTransaction();
  } catch (err) {
    console.error("Seed failed: ", err);
    await queryRunner.rollbackTransaction();
    process.exit(1);
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

seed();
