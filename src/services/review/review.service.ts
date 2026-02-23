import type ReviewRepositoryService from "./review_repository.service.ts";

export class ReviewService {
  private readonly reviewRepositoryService: ReviewRepositoryService;

  constructor(reviewRepositoryService: ReviewRepositoryService) {
    this.reviewRepositoryService = reviewRepositoryService;
  }
}
