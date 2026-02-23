import express from "express";
import userRouter from "./src/routers/user_router.ts";
import { errorHandler } from "./src/middlewares/errorHandler.ts";
import productRouter from "./src/routers/product_router.ts";

const app = express();

app.use(express.json());

app.use(errorHandler);

app.use("/users", userRouter);

app.use("/products", productRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
