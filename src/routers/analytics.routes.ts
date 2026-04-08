import { Router } from "express";
import AnalyticsController from "../controllers/analytics/analytics.controller.js";
import UserPreferenceService from "../services/user-preference.service.js";
import { Wishlist } from "../models/Wishlist.model.js";
import { CartCheckoutSession } from "../models/CartCheckoutSession.model.js";
import { mongoDataSource } from "../DataSource.js";
import { Cart } from "../models/Cart.model.js";

const analyticsRouter = Router();
const cartRepository = mongoDataSource.getMongoRepository(Cart);
const wisthlistRepository = mongoDataSource.getMongoRepository(Wishlist);
const cartCheckoutSessioinRepository =
  mongoDataSource.getMongoRepository(CartCheckoutSession);

const userPreferencesService = new UserPreferenceService(
  cartRepository,
  wisthlistRepository,
  cartCheckoutSessioinRepository,
);

const analyticsController = new AnalyticsController(userPreferencesService);

analyticsRouter
  .route("/user-preferences")
  .get(analyticsController.getUserPreferencesRequestHandler);

export default analyticsRouter;
