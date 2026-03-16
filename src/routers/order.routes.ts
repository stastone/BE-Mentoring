import { Router } from "express";
import OrderService from "../services/order.service.js";
import dataSource from "../DataSource.js";
import OrderController from "../controllers/order/order.controller.js";
import type { Product } from "../models/Product.model.js";
import type Order from "../models/Order.model.js";
import type OrderItem from "../models/OrderItem.model.js";
import { validate } from "../middlewares/validateSchema.js";
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  UpdateOrderItemSchema,
} from "../schemas/Order.schema.js";

const orderRouter = Router();

const productRepository = dataSource.getRepository<Product>("Product");
const orderRepository = dataSource.getRepository<Order>("Order");
const orderItemRepository = dataSource.getRepository<OrderItem>("OrderItem");

const orderService = new OrderService(
  orderRepository,
  productRepository,
  orderItemRepository,
  dataSource,
);

const orderController = new OrderController(orderService);

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
