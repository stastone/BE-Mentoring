import ReviewService from "../../services/review.service.js";

export default class ReviewController {
  private readonly _reviewService: ReviewService;
  constructor(reviewService: ReviewService) {
    this._reviewService = reviewService;
  }
}
