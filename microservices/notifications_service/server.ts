import "reflect-metadata";
import express from "express";
import { notificationsDataSource } from "./DataSource.js";
import { Notification } from "./models/Notification.model.js";
import { NotificationService } from "./NotificationService.js";
import { runConsumer } from "../../message_broker/bullmq/runConsumer.js";
import type { InventoryOutcomePayload, OrderCreatedPayload } from "./types.js";

const PORT = 3300;
const ORDERS_CONSUMER_ID = "notifications-orders";
const INVENTORY_CONSUMER_ID = "notifications-inventory";

const start = async () => {
  await notificationsDataSource.initialize();

  const notificationService = new NotificationService(
    notificationsDataSource.getMongoRepository(Notification),
  );

  const app = express();
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.listen(PORT, () => {
    console.log(`Notifications service listening on http://localhost:${PORT}`);
  });

  runConsumer({
    consumerId: ORDERS_CONSUMER_ID,
    topic: "orders",
    handler: async (event) => {
      const payload = event.payload as OrderCreatedPayload;
      await notificationService.send({
        topic: event.topic,
        eventId: event._id,
        kind: "order.confirmation",
        recipient: payload.userId,
        subject: `Order ${payload.orderId} received`,
        body: `We received your order with ${payload.items.length} item(s).`,
      });
    },
  });

  runConsumer({
    consumerId: INVENTORY_CONSUMER_ID,
    topic: "inventory",
    handler: async (event) => {
      const payload = event.payload as InventoryOutcomePayload;
      const isReserved = payload.outcome === "reserved";
      await notificationService.send({
        topic: event.topic,
        eventId: event._id,
        kind: isReserved ? "order.reserved" : "order.rejected",
        recipient: payload.orderId,
        subject: isReserved
          ? `Order ${payload.orderId} confirmed`
          : `Order ${payload.orderId} could not be fulfilled`,
        body: isReserved
          ? "All items reserved; we'll ship shortly."
          : `Out of stock: ${JSON.stringify(payload.failures ?? [])}`,
      });
    },
  });
};

start().catch((err) => {
  console.error("Failed to start notifications service:", err);
  process.exit(1);
});
