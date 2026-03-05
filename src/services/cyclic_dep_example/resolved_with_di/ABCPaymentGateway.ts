import type {
  PaymentGateway,
  ChargeRequest,
  ChargeResult,
} from "./PaymentGateway.js";

class ABCPaymentGateway implements PaymentGateway {
  public charge = async (request: ChargeRequest): Promise<ChargeResult> => {
    console.log(
      `ABCPaymentGateway: queued ${request.amount} ${request.currency} for settlement`,
    );

    return {
      transactionId: `ledger_${Date.now().toString(36)}`,
      captured: false,
    };
  };
}

export default ABCPaymentGateway;
