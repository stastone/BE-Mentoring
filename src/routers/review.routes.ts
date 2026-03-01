import { Router } from "express";
import { NotImplementedError } from "../types/Error.js";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.use((_req, _res, _next) => {
  throw new NotImplementedError("Review routes are not implemented yet");
});

reviewRouter
  .route("/")
  .get((req, res) => {})
  .post((req, res) => {});

reviewRouter
  .route("/:reviewId")
  .get((req, res) => {})
  .patch((req, res) => {})
  .delete((req, res) => {});

export default reviewRouter;
