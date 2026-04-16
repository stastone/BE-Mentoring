import { Router } from "express";
import { mongoDataSource } from "../DataSource.js";
import { Cart } from "../models/Cart.model.js";
import CartService from "../services/cart.service.js";
import CartController from "../controllers/cart/cart.controller.js";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";

const cartRouter = Router();

const cartRepository = mongoDataSource.getMongoRepository(Cart);
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

cartRouter.use(authenticateJWT);

cartRouter
  .route("/items/:productId")
  .patch(cartController.updateItemQuantityRequestHandler)
  .delete(cartController.removeItemRequestHandler);

cartRouter.route("/items").post(cartController.addItemRequestHandler);

cartRouter
  .route("/")
  .get(cartController.getCartRequestHandler)
  .delete(cartController.clearCartRequestHandler);

export default cartRouter;
