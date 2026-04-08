import "reflect-metadata";
import express from "express";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { sqliteDataSource, mongoDataSource } from "./src/DataSource.js";

const app = express();

app.set("trust proxy", true);

app.use(express.json());

app.use(errorHandler);

await Promise.all([
  sqliteDataSource.initialize(),
  mongoDataSource.initialize(),
]);
const [
  { default: authRouter },
  { default: userRouter },
  { default: productRouter },
  { default: categoryRouter },
  { default: orderRouter },
  { default: cartRouter },
  { default: analyticsRouter },
] = await Promise.all([
  import("./src/routers/auth.routes.js"),
  import("./src/routers/user.routes.js"),
  import("./src/routers/product.routes.js"),
  import("./src/routers/category.routes.js"),
  import("./src/routers/order.routes.js"),
  import("./src/routers/cart.routes.js"),
  import("./src/routers/analytics.routes.js"),
]);

app.use("/auth", authRouter);

app.use("/users", userRouter);

app.use("/products", productRouter);

app.use("/categories", categoryRouter);

app.use("/orders", orderRouter);

app.use("/carts", cartRouter);

app.use("/analytics", analyticsRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
