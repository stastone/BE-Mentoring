import { BadRequestError } from "../../../types/Error.js";
import type {
  ChargeRequest,
  ChargeResult,
  PaymentGateway,
} from "./PaymentGateway.js";

export type OrderRequest = {
  userId: string;
  amount: number;
  currency: string;
  paymentSource: string;
};

export type OrderReceipt = {
  orderId: string;
  payment: ChargeResult;
};

class OrderService {
  private readonly _paymentGateway: PaymentGateway;

  constructor(paymentGateway: PaymentGateway) {
    this._paymentGateway = paymentGateway;
  }

  public placeOrder = async (order: OrderRequest): Promise<OrderReceipt> => {
    this.validate(order);

    const chargeRequest: ChargeRequest = {
      amount: order.amount,
      currency: order.currency,
      source: order.paymentSource,
    };

    const payment = await this._paymentGateway.charge(chargeRequest);

    return {
      orderId: `ord_${Date.now().toString(36)}`,
      payment,
    };
  };

  private validate = (order: OrderRequest) => {
    if (!order.userId) {
      throw new BadRequestError("userId is required");
    }

    if (order.amount <= 0) {
      throw new BadRequestError("amount must be positive");
    }
  };
}

export default OrderService;
