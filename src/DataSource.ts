import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "sqlite",
  database: "db1.backend_mentoring",
  entities: [__dirname + "/models/*{.js,.ts}"],
  synchronize: true,
});

export default dataSource;
