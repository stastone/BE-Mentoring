import type { BrokerPublisher } from "../../../message_broker/bullmq/BrokerPublisher.js";
import type { DomainEvents } from "../domainEvents.js";

export const forwardOrderCreated =
  (publisher: BrokerPublisher) =>
  async (event: DomainEvents["OrderCreated"]): Promise<void> => {
    await publisher.publish("orders", event.orderId, event);
  };
