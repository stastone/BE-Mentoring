import { Router } from "express";

const reviewRouter = Router({ mergeParams: true });

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
