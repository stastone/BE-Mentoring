import "reflect-metadata";
import { DataSource } from "typeorm";
import { Stock } from "./models/Stock.model.js";

export const inventoryDataSource = new DataSource({
  type: "mongodb",
  url:
    process.env.INVENTORY_MONGO_URL ??
    "mongodb+srv://staan:password@1@cluster0.gqwnyyf.mongodb.net/inventory",
  entities: [Stock],
  synchronize: false,
});
