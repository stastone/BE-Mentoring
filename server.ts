import express from "express";
import userRouter from "./src/routers/user_router.ts";

const app = express();

app.use(express.json());

app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
