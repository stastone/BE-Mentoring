import { Router } from "express";
import OrderService from "../services/order.service.js";
import { sqliteDataSource } from "../DataSource.js";
import OrderController from "../controllers/order/order.controller.js";
import type { Product } from "../models/Product.model.js";
import type { Order } from "../models/Order.model.js";
import type { OrderItem } from "../models/OrderItem.model.js";
import { validate } from "../middlewares/validateSchema.js";
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  UpdateOrderItemSchema,
} from "../schemas/Order.schema.js";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";

const orderRouter = Router();

const productRepository = sqliteDataSource.getRepository<Product>("Product");
const orderRepository = sqliteDataSource.getRepository<Order>("Order");
const orderItemRepository =
  sqliteDataSource.getRepository<OrderItem>("OrderItem");

const orderService = new OrderService(
  orderRepository,
  productRepository,
  orderItemRepository,
  sqliteDataSource,
);

const orderController = new OrderController(orderService);

orderRouter.use(authenticateJWT);

orderRouter
  .route("/:orderId/status")
  .patch(
    validate(UpdateOrderStatusSchema),
    orderController.updateOrderStatusRequestHandler,
  );

orderRouter
  .route("/:orderId/items/:productId")
  .delete(orderController.deleteOrderItemRequestHandler);

orderRouter
  .route("/:orderId/items")
  .patch(
    validate(UpdateOrderItemSchema),
    orderController.updateOrderItemRequestHandler,
  );

orderRouter.route("/:orderId").get(orderController.getOrderByIdRequestHandler);

orderRouter
  .route("/")
  .get(orderController.getOrdersByUserRequestHandler)
  .post(validate(CreateOrderSchema), orderController.createOrderRequestHandler);

export default orderRouter;
