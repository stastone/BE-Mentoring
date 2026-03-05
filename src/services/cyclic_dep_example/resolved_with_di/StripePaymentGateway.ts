import type {
  ChargeRequest,
  ChargeResult,
  PaymentGateway,
} from "./PaymentGateway.js";

class StripePaymentGateway implements PaymentGateway {
  public charge = async (request: ChargeRequest): Promise<ChargeResult> => {
    console.log(
      `StripePaymentGateway: charging ${request.amount} ${request.currency}`,
    );

    return {
      transactionId: `stripe_${Date.now().toString(36)}`,
      captured: true,
    };
  };
}

export default StripePaymentGateway;
