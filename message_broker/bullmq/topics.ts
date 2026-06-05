export const TOPIC_SUBSCRIBERS: Record<string, readonly string[]> = {
  orders: ["inventory-service", "notifications-orders"],
  inventory: ["notifications-inventory"],
};

export const subscriberQueueName = (
  topic: string,
  consumerId: string,
): string => `${topic}.${consumerId}`;
