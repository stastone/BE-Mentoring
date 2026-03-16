import { DataSource } from "typeorm";

import { User } from "./models/User.model.js";
import { Product } from "./models/Product.model.js";
import { Review } from "./models/Review.model.js";
import { Category } from "./models/Category.model.js";
import Order from "./models/Order.model.js";
import OrderItem from "./models/OrderItem.model.js";

const dataSource = new DataSource({
  type: "sqlite",
  database: "backend_mentoring.db",
  entities: [User, Product, Review, Category, Order, OrderItem],
  synchronize: true,
});

export default dataSource;
