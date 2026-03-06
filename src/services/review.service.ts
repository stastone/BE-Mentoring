import type { Repository } from "typeorm";
import type { Review } from "../models/Review.model.js";

class ReviewService {
  private readonly _reviewRepository: Repository<Review>;

  constructor(reviewRepository: Repository<Review>) {
    this._reviewRepository = reviewRepository;
  }
}

export default ReviewService;
