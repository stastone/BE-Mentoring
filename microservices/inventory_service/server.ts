import "reflect-metadata";
import express from "express";
import { inventoryDataSource } from "./DataSource.js";
import { Stock } from "./models/Stock.model.js";
import { StockService } from "./StockService.js";
import { BrokerClient } from "../../message_broker/client/BrokerClient.js";
import { runConsumer } from "../../message_broker/client/runConsumer.js";

const PORT = Number(process.env.INVENTORY_PORT ?? 3200);
const CONSUMER_ID = process.env.INVENTORY_CONSUMER_ID ?? "inventory-service";

interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number; purchasePrice: number }[];
}

const start = async () => {
  await inventoryDataSource.initialize();

  const stockService = new StockService(
    inventoryDataSource.getMongoRepository(Stock),
  );
  const brokerClient = new BrokerClient();

  const app = express();
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/stock/:productId", async (req, res, next) => {
    try {
      const stock = await stockService.getStock(req.params.productId);
      res.json({ data: { productId: stock.productId, quantity: stock.quantity } });
    } catch (err) {
      next(err);
    }
  });
  app.listen(PORT, () => {
    console.log(`Inventory service listening on http://localhost:${PORT}`);
  });

  runConsumer({
    client: brokerClient,
    consumerId: CONSUMER_ID,
    topic: "orders",
    handler: async (event) => {
      const payload = event.payload as OrderCreatedPayload;
      console.log(
        `[inventory] received order.created ${payload.orderId} (seq=${event.seq}, redelivered=${event.redelivered})`,
      );

      const result = await stockService.reserve(payload.items);

      if (result.ok) {
        await brokerClient.publish("inventory", payload.orderId, {
          orderId: payload.orderId,
          outcome: "reserved",
        });
        console.log(`[inventory] reserved stock for ${payload.orderId}`);
      } else {
        await brokerClient.publish("inventory", payload.orderId, {
          orderId: payload.orderId,
          outcome: "rejected",
          failures: result.failures,
        });
        console.log(
          `[inventory] rejected ${payload.orderId}:`,
          result.failures,
        );
      }
    },
  }).catch((err) => {
    console.error("[inventory] consumer loop crashed:", err);
    process.exit(1);
  });
};

start().catch((err) => {
  console.error("Failed to start inventory service:", err);
  process.exit(1);
});
