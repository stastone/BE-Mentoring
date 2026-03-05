import { DataSource } from "typeorm";

import { User } from "./models/User.model.js";
import { Product } from "./models/Product.model.js";

const dataSource = new DataSource({
  type: "sqlite",
  database: "backend_mentoring.db",
  entities: [User, Product],
  synchronize: true,
});

export default dataSource;
