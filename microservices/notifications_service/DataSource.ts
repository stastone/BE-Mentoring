import "reflect-metadata";
import { DataSource } from "typeorm";
import { Notification } from "./models/Notification.model.js";

export const notificationsDataSource = new DataSource({
  type: "mongodb",
  url:
    process.env.NOTIFICATIONS_MONGO_URL ??
    "mongodb+srv://staan:password@1@cluster0.gqwnyyf.mongodb.net/notifications",
  entities: [Notification],
  synchronize: false,
});
