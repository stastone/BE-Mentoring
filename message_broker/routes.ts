import { Router } from "express";

const brokerRouter = Router();

brokerRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

brokerRouter.post("/topics/:topicId/publish", (req, res) => {
  res.status(501).json({ error: "not implemented" });
});

brokerRouter.post("/topics/:topicId/subscribe", (req, res) => {
  res.status(501).json({ error: "not implemented" });
});

brokerRouter.post("/topics/:topicId/ack", (req, res) => {
  res.status(501).json({ error: "not implemented" });
});

export default brokerRouter;
