import { DataSource } from "typeorm";
import { Cart } from "./models/Cart.model.js";
import { User } from "./models/User.model.js";
import { Product } from "./models/Product.model.js";
import { Review } from "./models/Review.model.js";
import { Category } from "./models/Category.model.js";
import { Order } from "./models/Order.model.js";
import { OrderItem } from "./models/OrderItem.model.js";
import { Wishlist } from "./models/Wishlist.model.js";
import { CartCheckoutSession } from "./models/CartCheckoutSession.model.js";
import { FeatureFlag } from "./models/FeatureFlag.model.js";

const isProduction = process.env.NODE_ENV === "production";
const entitiesPath = isProduction
  ? [
      "dist/src/models/User.model.js",
      "dist/src/models/Product.model.js",
      "dist/src/models/Review.model.js",
      "dist/src/models/Category.model.js",
      "dist/src/models/Order.model.js",
      "dist/src/models/OrderItem.model.js",
    ]
  : [User, Product, Review, Category, Order, OrderItem];
const mongoEntitiesPath = isProduction
  ? [
      "dist/src/models/Cart.model.js",
      "dist/src/models/Wishlist.model.js",
      "dist/src/models/CartCheckoutSession.model.js",
      "dist/src/models/FeatureFlag.model.js",
    ]
  : [Cart, Wishlist, CartCheckoutSession, FeatureFlag];
const migrationsPath = isProduction
  ? ["dist/src/database/migrations/*.js"]
  : ["src/database/migrations/*.ts"];

export const sqliteDataSource = new DataSource({
  type: "sqlite",
  database: "backend_mentoring.db",
  entities: entitiesPath,
  migrations: migrationsPath,
  synchronize: false,
});

export const mongoDataSource = new DataSource({
  type: "mongodb",
  url: `mongodb+srv://staan:password@1@cluster0.gqwnyyf.mongodb.net/`,
  entities: mongoEntitiesPath,
  synchronize: false,
});
