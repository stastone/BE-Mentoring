import express from "express";
import { brokerDataSource } from "./dataSource.js";
import brokerRouter from "./routes.js";

const app = express();

app.use(express.json());

app.use(brokerRouter);

const server = app.listen(3001, () => {
  console.log(`Message broker listening on http://localhost:3001`);
});
