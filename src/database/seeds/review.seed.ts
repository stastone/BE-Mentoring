import type { EntityManager } from "typeorm";
import { Review } from "../../models/Review.model.js";
import type { seedUsers } from "./user.seed.js";
import type { seedProducts } from "./product.seed.js";

type Users = Awaited<ReturnType<typeof seedUsers>>;
type Products = Awaited<ReturnType<typeof seedProducts>>;

export async function seedReviews(
  manager: EntityManager,
  users: Users,
  products: Products,
) {
  const { alice, bob } = users;
  const { iphone, samsung, macbook } = products;

  const review1 = manager.create(Review, {
    content: "Amazing phone, love the camera quality!",
    rating: 5,
    productId: iphone.id,
    userId: alice.id,
  });
  await manager.save(Review, review1);

  const review2 = manager.create(Review, {
    content: "Great laptop, but a bit pricey.",
    rating: 4,
    productId: macbook.id,
    userId: bob.id,
  });
  await manager.save(Review, review2);

  const review3 = manager.create(Review, {
    content: "Solid Android alternative to iPhone.",
    rating: 4,
    productId: samsung.id,
    userId: bob.id,
  });
  await manager.save(Review, review3);

  return { review1, review2, review3 };
}
