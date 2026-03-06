import { BadRequestError } from "../../../types/Error.js";
import PaymentGatewayCircular from "./PaymentGatewayCircular.js";

export type CircularOrderRequest = {
  userId: string;
  amount: number;
  currency: string;
};

class OrderServiceCircular {
  private readonly _paymentGateway: PaymentGatewayCircular;

  constructor(paymentGateway: PaymentGatewayCircular) {
    this._paymentGateway = paymentGateway;
  }

  public placeOrder = async (order: CircularOrderRequest) => {
    if (!order.userId) {
      throw new BadRequestError("userId is required");
    }

    if (order.amount <= 0) {
      throw new BadRequestError("amount must be positive");
    }

    const transactionId = await this._paymentGateway.charge(order);
    console.log(`OrderServiceCircular: order confirmed ${transactionId}`);
  };

  public recordGatewayAudit = (transactionId: string) => {
    console.log(
      `OrderServiceCircular: audit trail persisted for ${transactionId}`,
    );
  };
}

export default OrderServiceCircular;
