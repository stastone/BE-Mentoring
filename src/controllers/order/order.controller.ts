import type { RequestHandler } from "express";
import type OrderService from "../../services/order.service.js";
import { BaseController, type ResponsePayload } from "../base.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";
import type { OrderItemType, OrderType } from "../../schemas/Order.schema.js";

class OrderController extends BaseController {
  private readonly _orderService: OrderService;

  constructor(orderService: OrderService) {
    super();
    this._orderService = orderService;
  }

  public getOrdersByUserRequestHandler: RequestHandler<
    never,
    ResponsePayload<OrderType[]>,
    never,
    { userId: string }
  > = catchAsync(async (req, res) => {
    const { userId } = req.query;
    const orders = await this._orderService.getOrdersByUser(userId);

    this.ok(res, orders);
  });

  public getOrderByIdRequestHandler: RequestHandler<
    { orderId: string },
    ResponsePayload<OrderType>
  > = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const order = await this._orderService.getOrderById(orderId);

    this.ok(res, order);
  });

  public createOrderRequestHandler: RequestHandler<
    never,
    ResponsePayload<OrderType>,
    { userId: string; items: { productId: string; quantity: number }[] }
  > = catchAsync(async (req, res) => {
    const { userId, items } = req.body;
    const order = await this._orderService.createOrder(userId, items);

    this.created(res, order);
  });

  public updateOrderStatusRequestHandler: RequestHandler<
    { orderId: string },
    ResponsePayload<OrderType>,
    { status: "pending" | "completed" | "cancelled" }
  > = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await this._orderService.updateOrderStatus(orderId, status);

    this.ok(res, order);
  });

  public updateOrderItemRequestHandler: RequestHandler<
    { orderId: string },
    ResponsePayload<OrderItemType>,
    { productId: string; quantity: number }
  > = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const { productId, quantity } = req.body;
    const orderItem = await this._orderService.updateOrderItem(
      orderId,
      productId,
      quantity,
    );

    this.ok(res, orderItem);
  });

  public deleteOrderItemRequestHandler: RequestHandler<
    { orderId: string; productId: string },
    ResponsePayload<null>
  > = catchAsync(async (req, res) => {
    const { orderId, productId } = req.params;
    await this._orderService.deleteOrderItem(orderId, productId);

    this.ok(res, null);
  });
}

export default OrderController;
