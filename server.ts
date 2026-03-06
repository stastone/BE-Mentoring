import "reflect-metadata";
import express from "express";
import userRouter from "./src/routers/user.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import productRouter from "./src/routers/product.routes.js";
import authRouter from "./src/routers/auth.routes.js";
import dataSource from "./src/DataSource.js";

const app = express();

app.use(express.json());

app.use(errorHandler);

await dataSource.initialize();

app.use("/auth", authRouter);

app.use("/users", userRouter);

app.use("/products", productRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
