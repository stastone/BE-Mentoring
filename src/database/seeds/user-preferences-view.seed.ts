import type { Db } from "mongodb";
import type { DataSource } from "typeorm";
import { Cart } from "../../models/Cart.model.js";
import { Wishlist } from "../../models/Wishlist.model.js";
import { CartCheckoutSession } from "../../models/CartCheckoutSession.model.js";

export async function seedUserPreferencesView(dataSource: DataSource) {
  const mongoDriver = dataSource.driver as {
    queryRunner?: { databaseConnection?: { db: () => Db } };
  };

  const db = mongoDriver.queryRunner?.databaseConnection?.db();

  if (!db) {
    throw new Error("Mongo database connection is not initialized");
  }

  const cartCollectionName =
    dataSource.getMongoRepository(Cart).metadata.tableName;
  const wishlistCollectionName =
    dataSource.getMongoRepository(Wishlist).metadata.tableName;
  const checkoutCollectionName =
    dataSource.getMongoRepository(CartCheckoutSession).metadata.tableName;
  const viewName = "user_preferences_view";

  const existingCollections = await db.listCollections().toArray();
  const existingCollectionNames = new Set(
    existingCollections.map((c: { name: string }) => c.name),
  );

  // MongoDB requires the source collection for viewOn to exist.
  if (!existingCollectionNames.has(checkoutCollectionName)) {
    await db.createCollection(checkoutCollectionName);
  }

  // Create missing lookup collections so view creation doesn't fail on fresh DBs.
  if (!existingCollectionNames.has(cartCollectionName)) {
    await db.createCollection(cartCollectionName);
  }

  if (!existingCollectionNames.has(wishlistCollectionName)) {
    await db.createCollection(wishlistCollectionName);
  }

  // Drop existing view/collection with the same name if it exists.
  try {
    await db.dropCollection(viewName);
  } catch (err) {
    // Doesn't exist, nothing to drop.
  }

  // Create the view with the aggregation pipeline
  await db.createCollection(viewName, {
    viewOn: checkoutCollectionName,
    pipeline: [
      {
        $match: {
          status: "completed",
        },
      },

      // Join the cart used in the checkout to get which products were bought
      {
        $lookup: {
          from: cartCollectionName,
          let: { cartId: "$cartId", userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toString: "$_id" }, "$$cartId"] },
                    { $eq: ["$userId", "$$userId"] },
                  ],
                },
              },
            },
            { $unwind: "$items" },
            {
              $project: {
                _id: 0,
                productId: "$items.productId",
                quantity: "$items.quantity",
              },
            },
          ],
          as: "purchasedItems",
        },
      },

      // Drop sessions whose cart was empty or not found
      { $match: { "purchasedItems.0": { $exists: true } } },

      // Join wishlists for the same user to get their stated desire signals
      {
        $lookup: {
          from: wishlistCollectionName,
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
            { $unwind: "$items" },
            {
              $project: {
                _id: 0,
                productId: "$items.productId",
                priority: "$items.priority",
              },
            },
          ],
          as: "wishlistItems",
        },
      },

      // One document per purchased product per session
      { $unwind: "$purchasedItems" },

      // Resolve wishlist priority for this product (0 if never wishlisted)
      {
        $addFields: {
          wishlistPriority: {
            $let: {
              vars: {
                matched: {
                  $first: {
                    $filter: {
                      input: "$wishlistItems",
                      as: "wi",
                      cond: {
                        $eq: ["$$wi.productId", "$purchasedItems.productId"],
                      },
                    },
                  },
                },
              },
              in: { $ifNull: ["$$matched.priority", 0] },
            },
          },
        },
      },

      // Aggregate per user + product across all their sessions
      {
        $group: {
          _id: { userId: "$userId", productId: "$purchasedItems.productId" },
          purchaseCount: { $sum: 1 },
          totalQuantityBought: { $sum: "$purchasedItems.quantity" },
          maxWishlistPriority: { $max: "$wishlistPriority" },
          wasWishlisted: {
            $max: { $cond: [{ $gt: ["$wishlistPriority", 0] }, 1, 0] },
          },
        },
      },

      // Composite preference score: purchases × 3 + total quantity + wishlist priority × 2
      {
        $addFields: {
          preferenceScore: {
            $add: [
              { $multiply: ["$purchaseCount", 3] },
              "$totalQuantityBought",
              { $multiply: ["$maxWishlistPriority", 2] },
            ],
          },
        },
      },

      // Roll up into one document per user with a ranked preference list
      {
        $group: {
          _id: "$_id.userId",
          preferences: {
            $push: {
              productId: "$_id.productId",
              purchaseCount: "$purchaseCount",
              totalQuantityBought: "$totalQuantityBought",
              maxWishlistPriority: "$maxWishlistPriority",
              wasWishlisted: { $eq: ["$wasWishlisted", 1] },
              preferenceScore: "$preferenceScore",
            },
          },
        },
      },

      // Sort preferences by score descending within each user document
      {
        $addFields: {
          preferences: {
            $sortArray: {
              input: "$preferences",
              sortBy: { preferenceScore: -1 },
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          userId: "$_id",
          preferences: 1,
        },
      },
    ],
  });

  console.log(`✓ Created ${viewName} MongoDB view`);
}
