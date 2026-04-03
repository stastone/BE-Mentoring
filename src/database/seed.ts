import { sqliteDataSource, mongoDataSource } from "../DataSource.js";
import { Category } from "../models/Category.model.js";
import { User } from "../models/User.model.js";
import { Product } from "../models/Product.model.js";
import { Order } from "../models/Order.model.js";
import { OrderItem } from "../models/OrderItem.model.js";
import { Review } from "../models/Review.model.js";
import { Cart } from "../models/Cart.model.js";
import { Wishlist } from "../models/Wishlist.model.js";
import { CartCheckoutSession } from "../models/CartCheckoutSession.model.js";
import { seedCategories } from "./seeds/category.seed.js";
import { seedUsers } from "./seeds/user.seed.js";
import { seedProducts } from "./seeds/product.seed.js";
import { seedOrders } from "./seeds/order.seed.js";
import { seedOrderItems } from "./seeds/orderItem.seed.js";
import { seedReviews } from "./seeds/review.seed.js";
import { seedCarts } from "./seeds/cart.seed.js";
import { seedUserPreferencesView } from "./seeds/user-preferences-view.seed.js";

async function seed() {
  await Promise.all([
    sqliteDataSource.initialize(),
    mongoDataSource.initialize(),
  ]);

  const queryRunner = sqliteDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.manager.clear(Review);
    await queryRunner.manager.clear(OrderItem);
    await queryRunner.manager.clear(Order);
    await queryRunner.manager.clear(Product);
    await queryRunner.manager.clear(Category);
    await queryRunner.manager.clear(User);

    await mongoDataSource.getMongoRepository(Cart).deleteMany({});
    await mongoDataSource.getMongoRepository(Wishlist).deleteMany({});
    await mongoDataSource
      .getMongoRepository(CartCheckoutSession)
      .deleteMany({});

    const categories = await seedCategories(queryRunner.manager);
    const users = await seedUsers(queryRunner.manager);
    const products = await seedProducts(queryRunner.manager, categories);
    const orders = await seedOrders(queryRunner.manager, users);
    await seedOrderItems(queryRunner.manager, orders, products);
    await seedReviews(queryRunner.manager, users, products);

    await queryRunner.commitTransaction();

    await seedCarts(mongoDataSource.manager, users, products);
    await seedUserPreferencesView(mongoDataSource);
  } catch (err) {
    console.error("Seed failed: ", err);

    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    process.exit(1);
  } finally {
    await queryRunner.release();
    await Promise.all([sqliteDataSource.destroy(), mongoDataSource.destroy()]);
  }
}

seed();
