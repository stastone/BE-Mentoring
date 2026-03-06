export type ChargeRequest = {
  amount: number;
  currency: string;
  source: string;
};

export type ChargeResult = {
  transactionId: string;
  captured: boolean;
};

export interface PaymentGateway {
  charge(request: ChargeRequest): Promise<ChargeResult>;
}
