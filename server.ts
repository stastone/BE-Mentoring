import "reflect-metadata";
import express from "express";
import userRouter from "./src/routers/user.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import productRouter from "./src/routers/product.routes.js";
import authRouter from "./src/routers/auth.routes.js";
import { sqliteDataSource, mongoDataSource } from "./src/DataSource.js";
import categoryRouter from "./src/routers/category.routes.js";
import orderRouter from "./src/routers/order.routes.js";
import cartRouter from "./src/routers/cart.routes.js";

const app = express();

app.use(express.json());

app.use(errorHandler);

await Promise.all([
  sqliteDataSource.initialize(),
  mongoDataSource.initialize(),
]);

app.use("/auth", authRouter);

app.use("/users", userRouter);

app.use("/products", productRouter);

app.use("/categories", categoryRouter);

app.use("/orders", orderRouter);

app.use("/carts", cartRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
