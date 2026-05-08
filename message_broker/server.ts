import express from "express";
import { brokerDataSource } from "./DataSource.js";
import { Event } from "./models/Event.model.js";
import { Subscription } from "./models/Subscription.model.js";
import { TopicCounter } from "./models/TopicCounter.model.js";
import EventService from "./services/Event.service.js";
import SubscriptionService from "./services/Subscription.service.js";
import { MessageBroker } from "./MessageBroker.js";
import { buildBrokerRouter } from "./routes.js";
import { brokerErrorHandler } from "./middlewares/errorHandler.js";

const PORT = Number(process.env.BROKER_PORT ?? 3100);

await brokerDataSource.initialize();

const eventService = new EventService(
  brokerDataSource.getMongoRepository(Event),
  brokerDataSource.getMongoRepository(TopicCounter),
);

const subscriptionService = new SubscriptionService(
  brokerDataSource.getMongoRepository(Subscription),
);

const broker = new MessageBroker(eventService, subscriptionService);

const app = express();

app.use(express.json());
app.use(buildBrokerRouter(broker));
app.use(brokerErrorHandler);

app.listen(PORT, () => {
  console.log(`Message broker listening on http://localhost:${PORT}`);
});
