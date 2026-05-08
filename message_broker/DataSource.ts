import "reflect-metadata";
import { DataSource } from "typeorm";
import { Event } from "./models/Event.model.js";
import { Subscription } from "./models/Subscription.model.js";
import { TopicCounter } from "./models/TopicCounter.model.js";

export const brokerDataSource = new DataSource({
  type: "mongodb",
  url: `mongodb+srv://staan:password@1@cluster0.gqwnyyf.mongodb.net/broker`,
  entities: [Event, Subscription, TopicCounter],
  synchronize: false,
});
