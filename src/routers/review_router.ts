import { Router } from "express";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.route("/").get().post();

reviewRouter.route("/:reviewId").get().patch().delete();

export default reviewRouter;
