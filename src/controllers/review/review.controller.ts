import type { ReviewService } from "../../services/review.service.ts";

export default class ReviewController {
  private readonly _reviewService: ReviewService;
  constructor(reviewService: ReviewService) {
    this._reviewService = reviewService;
  }
}
