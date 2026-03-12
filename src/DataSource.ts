import { DataSource } from "typeorm";

import { User } from "./models/User.model.js";
import { Product } from "./models/Product.model.js";
import { Review } from "./models/Review.model.js";
import { Category } from "./models/Category.model.js";

const dataSource = new DataSource({
  type: "sqlite",
  database: "backend_mentoring.db",
  entities: [User, Product, Review, Category],
  synchronize: true,
});

export default dataSource;
