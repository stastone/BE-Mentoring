import OrderServiceCircular from "./OrderServiceCircular.js";
import PaymentGatewayCircular from "./PaymentGatewayCircular.js";

// Step1: Order service depends on payment gateway
const buildOrderService = (): OrderServiceCircular => {
  // To build the order service we first need a payment gateway...
  const gateway = buildGateway();
  return new OrderServiceCircular(gateway);
};

// Step2: Payment gateway depends on order service
const buildGateway = (): PaymentGatewayCircular => {
  const orderService = buildOrderService();
  return new PaymentGatewayCircular(orderService);
};
