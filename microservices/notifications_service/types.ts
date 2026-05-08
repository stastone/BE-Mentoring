export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number }[];
}

export interface InventoryOutcomePayload {
  orderId: string;
  outcome: "reserved" | "rejected";
  failures?: { productId: string; requested: number; available: number }[];
}

export interface NotificationInput {
  topic: string;
  eventId: string;
  kind: string;
  recipient: string;
  subject: string;
  body: string;
}
