import { DataSource } from "typeorm";

import { User } from "./models/User.js";
import { Product } from "./models/Product.js";

const dataSource = new DataSource({
  type: "sqlite",
  database: "backend_mentoring.db",
  entities: [User, Product],
  synchronize: true,
});

export default dataSource;
