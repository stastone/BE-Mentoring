interface OrderItem {
  productId: string;
  quantity: number;
  purchasePrice: number;
}

export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  status: string;
  items: Array<OrderItem>;
}

export interface DomainEvents {
  OrderCreated: OrderCreatedPayload;
}
