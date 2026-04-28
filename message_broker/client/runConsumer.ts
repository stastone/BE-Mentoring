import type { DeliveredEvent } from "../types/DeliveredEvent.js";
import type { BrokerClient } from "./BrokerClient.js";

interface ConsumerOptions {
  client: BrokerClient;
  consumerId: string;
  topic: string;
  pollIntervalMs?: number;
  fromStart?: boolean;
  handler: (event: DeliveredEvent) => Promise<void>;
}

export const runConsumer = async (options: ConsumerOptions): Promise<void> => {
  const {
    client,
    consumerId,
    topic,
    handler,
    pollIntervalMs = 500,
    fromStart = false,
  } = options;

  await client.subscribe(consumerId, topic, fromStart);
  console.log(`[${consumerId}] subscribed to "${topic}"`);

  while (true) {
    try {
      const event = await client.poll(consumerId, topic);

      if (!event) {
        await sleep(pollIntervalMs);
        continue;
      }

      try {
        await handler(event);
        await client.acknowledge(consumerId, topic, event._id);
      } catch (handlerErr) {
        console.error(
          `[${consumerId}] handler error for event ${event._id} on "${topic}":`,
          handlerErr,
        );
      }
    } catch (pollErr) {
      console.error(`[${consumerId}] poll error on "${topic}":`, pollErr);
      await sleep(pollIntervalMs);
    }
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
