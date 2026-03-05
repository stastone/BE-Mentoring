import type { CircularOrderRequest } from "./OrderServiceCircular.js";
import OrderServiceCircular from "./OrderServiceCircular.js";

class PaymentGatewayCircular {
  private readonly _orderService: OrderServiceCircular;

  constructor(orderService: OrderServiceCircular) {
    this._orderService = orderService;
  }

  public charge = async (_order: CircularOrderRequest) => {
    const transactionId = `tx_${Date.now().toString(36)}`;
    console.log(`PaymentGatewayCircular: charged via ${transactionId}`);

    this._orderService.recordGatewayAudit(transactionId);
    return transactionId;
  };
}

export default PaymentGatewayCircular;
