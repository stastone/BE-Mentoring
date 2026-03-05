import OrderService from "./OrderService.js";
import StripePaymentGateway from "./StripePaymentGateway.js";
import ABCPaymentGateway from "./ABCPaymentGateway.js";

export const buildStripeOrderService = () => {
  return new OrderService(new StripePaymentGateway());
};

export const buildABCOrderService = () => {
  return new OrderService(new ABCPaymentGateway());
};
