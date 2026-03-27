import { DataSource } from "typeorm";
import { Cart } from "./models/Cart.model.js";
import { User } from "./models/User.model.js";
import { Product } from "./models/Product.model.js";
import { Review } from "./models/Review.model.js";
import { Category } from "./models/Category.model.js";
import { Order } from "./models/Order.model.js";
import { OrderItem } from "./models/OrderItem.model.js";

export const sqliteDataSource = new DataSource({
  type: "sqlite",
  database: "backend_mentoring.db",
  entities: [User, Product, Review, Category, Order, OrderItem],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
});

export const mongoDataSource = new DataSource({
  type: "mongodb",
  url: `mongodb+srv://staan:password@1@cluster0.gqwnyyf.mongodb.net/`,
  entities: [Cart],
  synchronize: false,
});
