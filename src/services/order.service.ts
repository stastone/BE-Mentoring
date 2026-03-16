import type { DataSource, Repository } from "typeorm";
import Order from "../models/Order.model.js";
import OrderItem from "../models/OrderItem.model.js";
import type { Product } from "../models/Product.model.js";
import { BadRequestError, NotFoundError } from "../types/Error.js";

interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

class OrderService {
  private readonly _orderRepository: Repository<Order>;
  private readonly _productRepository: Repository<Product>;
  private readonly _dataSource: DataSource;

  constructor(
    orderRepository: Repository<Order>,
    productRepository: Repository<Product>,
    dataSource: DataSource,
  ) {
    this._orderRepository = orderRepository;
    this._productRepository = productRepository;
    this._dataSource = dataSource;
  }

  public getOrdersByUser = async (userId: string) => {
    return this._orderRepository.find({
      where: { userId },
      relations: ["items", "items.product"],
    });
  };

  public getOrderById = async (id: string) => {
    const order = await this._orderRepository.findOne({
      where: { id },
      relations: ["items", "items.product", "user"],
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return order;
  };

  public createOrder = async (
    userId: string,
    items: CreateOrderItemPayload[],
  ) =>
    this._dataSource.transaction(async (manager) => {
      const order = manager.create(Order, { userId });
      const savedOrder = await manager.save(order);

      for (const item of items) {
        if (item.quantity <= 0) {
          throw new BadRequestError(
            `Invalid quantity for product ${item.productId}`,
          );
        }

        const product = await this._productRepository.findOneBy({
          id: item.productId,
        });

        if (!product) {
          throw new NotFoundError(`Product ${item.productId} not found`);
        }

        const orderItem = manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: product.id,
          quantity: item.quantity,
          purchasePrice: product.price,
        });

        await manager.save(orderItem);
      }

      return manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: ["items", "items.product"],
      });
    });

  public updateOrderItem = async (
    orderId: string,
    productId: string,
    quantity: number,
  ) => {
    const orderItem = await this._dataSource.getRepository(OrderItem).findOne({
      where: { orderId, productId },
      relations: ["order"],
    });

    if (!orderItem) {
      throw new NotFoundError("Order item not found");
    }

    if (orderItem.order.status === "cancelled") {
      throw new BadRequestError("Cannot update a cancelled order");
    }

    if (quantity <= 0) {
      throw new BadRequestError("Quantity must be greater than zero");
    }

    orderItem.quantity = quantity;
    return this._dataSource.getRepository(OrderItem).save(orderItem);
  };

  public updateOrderStatus = async (
    id: string,
    status: "pending" | "completed" | "cancelled",
  ) => {
    const order = await this._orderRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.status === "cancelled") {
      throw new BadRequestError("Cannot update a cancelled order");
    }

    order.status = status;

    return this._orderRepository.save(order);
  };

  public cancelOrder = async (id: string) => {
    return this.updateOrderStatus(id, "cancelled");
  };
}

export default OrderService;
