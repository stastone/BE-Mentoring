import { Router } from "express";
import { mongoDataSource } from "../DataSource.js";
import { Cart } from "../models/Cart.model.js";
import CartService from "../services/cart.service.js";
import CartController from "../controllers/cart/cart.controller.js";

const cartRouter = Router();

const cartRepository = mongoDataSource.getMongoRepository(Cart);
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

cartRouter
  .route("/:userId/items/:productId")
  .patch(cartController.updateItemQuantityRequestHandler)
  .delete(cartController.removeItemRequestHandler);

cartRouter
  .route("/:userId/items")
  .post(cartController.addItemRequestHandler);

cartRouter
  .route("/:userId")
  .get(cartController.getCartRequestHandler)
  .delete(cartController.clearCartRequestHandler);

export default cartRouter;
