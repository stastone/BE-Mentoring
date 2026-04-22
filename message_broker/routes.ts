import { Router } from "express";
import { catchAsync } from "../src/utils/catchAsync.js";
import { validate } from "../src/middlewares/validateSchema.js";
import type { MessageBroker } from "./MessageBroker.js";
import {
  AckBodySchema,
  PollQuerySchema,
  PublishBodySchema,
  SubscribeBodySchema,
  type AckBody,
  type PollQuery,
  type PublishBody,
  type SubscribeBody,
} from "./schemas/Broker.schema.js";

const router = Router();

export const buildBrokerRouter = (broker: MessageBroker): Router => {
  router.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  router.post<{ topic: string }, unknown, PublishBody>(
    "/topics/:topic/publish",
    validate(PublishBodySchema),
    catchAsync(async (req, res) => {
      const { topic } = req.params;
      const { eventId, payload } = req.body;
      const result = await broker.publish(topic, eventId, payload);
      res
        .status(result.duplicate ? 200 : 202)
        .json({ success: true, data: result });
    }),
  );

  router.post<{ topic: string }, unknown, SubscribeBody>(
    "/topics/:topic/subscribe",
    validate(SubscribeBodySchema),
    catchAsync(async (req, res) => {
      const { topic } = req.params;
      const { consumerId, fromStart } = req.body;
      const result = await broker.subscribe(consumerId, topic, fromStart);
      res
        .status(result.created ? 201 : 200)
        .json({ success: true, data: result });
    }),
  );

  router.get<{ topic: string }, unknown, never, PollQuery>(
    "/topics/:topic/poll",
    validate(PollQuerySchema, "query"),
    catchAsync(async (req, res) => {
      const { topic } = req.params;
      const { consumerId } = req.query;
      const event = await broker.claimNext(consumerId, topic);
      if (!event) {
        res.status(204).end();
        return;
      }
      res.status(200).json({ success: true, data: event });
    }),
  );

  router.post<{ topic: string }, unknown, AckBody>(
    "/topics/:topic/ack",
    validate(AckBodySchema),
    catchAsync(async (req, res) => {
      const { topic } = req.params;
      const { consumerId, eventId } = req.body;
      const acknowledged = await broker.acknowledgeEvent(
        consumerId,
        topic,
        eventId,
      );
      res
        .status(acknowledged ? 200 : 409)
        .json({ success: acknowledged, data: { acknowledged } });
    }),
  );

  return router;
};
