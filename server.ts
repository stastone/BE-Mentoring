import express from "express";
import {
  createUserRequestHandler,
  getUserByIdRequestHandler,
  getUsersRequestHandler,
  updateUserEmailRequestHandler,
} from "./src/controllers/user_controller.ts";

const app = express();

app.use(express.json());

app
  .route("/users/:userId")
  .get(getUserByIdRequestHandler)
  .put(updateUserEmailRequestHandler);

app.route("/users").get(getUsersRequestHandler).post(createUserRequestHandler);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
