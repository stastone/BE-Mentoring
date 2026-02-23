import { DataSource } from "typeorm";
import { dirname } from "path";

const dataSource = new DataSource({
  type: "sqlite",
  database: "db1.backend_mentoring",
  entities: [dirname + "/models/*{.js,.ts}"],
  synchronize: true,
});

export default dataSource;
