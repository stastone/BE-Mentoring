import { Queue } from "bullmq";
import { connection } from "./connection.js";
import { TOPIC_SUBSCRIBERS, subscriberQueueName } from "./topics.js";
import type { BrokerJobData } from "./types.js";

// JOB CONFIGURATION:
const JOB_OPTIONS = {
  removeOnComplete: 1000,
  removeOnFail: 5000,
  attempts: 10,
  backoff: { type: "exponential" as const, delay: 1000 },
};

export class BrokerPublisher {
  private readonly _queues = new Map<string, Queue>();

  private getQueue = (name: string): Queue => {
    let queue = this._queues.get(name);
    if (!queue) {
      queue = new Queue(name, { connection });
      this._queues.set(name, queue);
    }
    return queue;
  };

  public publish = async <T>(topic: string, eventId: string, payload: T) => {
    const subscribers = TOPIC_SUBSCRIBERS[topic] ?? [];

    if (subscribers.length === 0) {
      console.warn(`[broker] publish to "${topic}" has no subscribers`);
    }

    const data: BrokerJobData = { topic, eventId, payload };

    const fanout = await Promise.all(
      subscribers.map(async (consumerId) => {
        const queue = this.getQueue(subscriberQueueName(topic, consumerId));

        await queue.add(topic, data, { ...JOB_OPTIONS, jobId: eventId });
        return consumerId;
      }),
    );

    return { eventId, fanout };
  };

  public close = async (): Promise<void> => {
    await Promise.all([...this._queues.values()].map((queue) => queue.close()));
    this._queues.clear();
  };
}
