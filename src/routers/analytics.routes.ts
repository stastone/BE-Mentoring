import { Router } from "express";
import AnalyticsController from "../controllers/analytics/analytics.controller.js";
import UserPreferenceService from "../services/user-preference.service.js";
import { Wishlist } from "../models/Wishlist.model.js";
import { CartCheckoutSession } from "../models/CartCheckoutSession.model.js";
import { FeatureFlag } from "../models/FeatureFlag.model.js";
import { mongoDataSource } from "../DataSource.js";
import { Cart } from "../models/Cart.model.js";
import { checkFeatureFlag } from "../middlewares/checkFeatureFlag.js";
import { validate } from "../middlewares/validateSchema.js";
import { UserPreferencesQuerySchema } from "../schemas/queries/UserPreferencesQuery.schema.js";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
import { restrictTo } from "../middlewares/restrictTo.js";

const analyticsRouter = Router();
const cartRepository = mongoDataSource.getMongoRepository(Cart);
const wisthlistRepository = mongoDataSource.getMongoRepository(Wishlist);
const cartCheckoutSessioinRepository =
  mongoDataSource.getMongoRepository(CartCheckoutSession);
const featureFlagRepository = mongoDataSource.getMongoRepository(FeatureFlag);

const userPreferencesService = new UserPreferenceService(
  cartRepository,
  wisthlistRepository,
  cartCheckoutSessioinRepository,
);

const analyticsController = new AnalyticsController(userPreferencesService);

analyticsRouter.use(authenticateJWT);

analyticsRouter
  .route("/user-preferences")

  .get(
    restrictTo(["admin"]),
    checkFeatureFlag(featureFlagRepository, "user-preferences-analytics"),
    validate(UserPreferencesQuerySchema, "query"),
    analyticsController.getUserPreferencesRequestHandler,
  );

export default analyticsRouter;
