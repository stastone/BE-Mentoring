import { faker } from "@faker-js/faker";
import type { EntityManager } from "typeorm";
import { Review } from "../../models/Review.model.js";
import type { seedUsers } from "./user.seed.js";
import type { seedProducts } from "./product.seed.js";

type Users = Awaited<ReturnType<typeof seedUsers>>;
type Products = Awaited<ReturnType<typeof seedProducts>>;

const REVIEWS = 3;

export async function seedReviews(
  manager: EntityManager,
  users: Users,
  products: Products,
) {
  const reviews: Review[] = [];

  for (const product of products) {
    const reviewers = faker.helpers.arrayElements(users.users, REVIEWS);

    for (const user of reviewers) {
      const review = manager.create(Review, {
        content: faker.lorem.sentences({ min: 1, max: 3 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        productId: product.id,
        userId: user.id,
      });
      await manager.save(Review, review);
      reviews.push(review);
    }
  }

  return reviews;
}
