import type { MongoRepository } from "typeorm";
import { Cart } from "../models/Cart.model.js";
import { Wishlist } from "../models/Wishlist.model.js";
import { CartCheckoutSession } from "../models/CartCheckoutSession.model.js";
import type { UserPreferences } from "../schemas/UserPreferences.schema.js";

class UserPreferenceService {
  private readonly _checkoutSessionRepository: MongoRepository<CartCheckoutSession>;

  private readonly _cartCollectionName: string;
  private readonly _wishlistCollectionName: string;

  constructor(
    cartRepository: MongoRepository<Cart>,
    wishlistRepository: MongoRepository<Wishlist>,
    checkoutSessionRepository: MongoRepository<CartCheckoutSession>,
  ) {
    this._checkoutSessionRepository = checkoutSessionRepository;
    this._cartCollectionName = cartRepository.metadata.tableName;
    this._wishlistCollectionName = wishlistRepository.metadata.tableName;
  }

  public getUserPreferences = async (filters: {
    userId?: string;
    limit?: number;
  }) => {
    return this._checkoutSessionRepository
      .aggregate<UserPreferences>([
        {
          $match: {
            status: "completed",
            ...(filters.userId ? { userId: filters.userId } : {}),
          },
        },

        // Join the cart used in the checkout to get which products were bought
        {
          $lookup: {
            from: this._cartCollectionName,
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
            from: this._wishlistCollectionName,
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

        // Optionally trim to top N products
        ...(filters.limit != null
          ? [
              {
                $addFields: {
                  preferences: { $slice: ["$preferences", filters.limit] },
                },
              },
            ]
          : []),

        {
          $project: {
            _id: 0,
            userId: "$_id",
            preferences: 1,
          },
        },
      ])
      .toArray();
  };
}

export default UserPreferenceService;
