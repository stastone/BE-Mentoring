import express from "express";
import userRouter from "./src/routers/user_router.ts";
import { errorHandler } from "./src/middlewares/errorHandler.ts";
import productRouter from "./src/routers/product_router.ts";
import authRouter from "./src/routers/auth_router.ts";

import { authenticateJWT } from "./src/middlewares/authenticateJWT.ts";

const app = express();

app.use(express.json());

app.use(errorHandler);

app.use("/auth", authRouter);

app.use("/users", userRouter);

app.use("/products", authenticateJWT, productRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
