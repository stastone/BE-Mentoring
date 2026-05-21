import { Worker } from "bullmq";
import type { Job } from "bullmq";
import { connection } from "./connection.js";
import { subscriberQueueName } from "./topics.js";
import type { BrokerEvent, BrokerJobData } from "./types.js";

interface ConsumerOptions {
  consumerId: string;
  topic: string;
  concurrency?: number;
  handler: (event: BrokerEvent) => Promise<void>;
}

export const runConsumer = (options: ConsumerOptions): Worker => {
  const { consumerId, topic, handler, concurrency = 1 } = options;
  const queueName = subscriberQueueName(topic, consumerId);

  const worker = new Worker(
    queueName,
    async (job: Job<BrokerJobData>) => {
      await handler({
        _id: job.data.eventId,
        topic: job.data.topic,
        payload: job.data.payload,
        // A previous attempt ran for this job => it is a redelivery.
        redelivered: (job.attemptsStarted ?? 1) > 1,
        attemptsMade: job.attemptsMade,
      });
    },
    { connection, concurrency },
  );

  worker.on("ready", () => {
    console.log(`[${consumerId}] consuming "${topic}" (queue ${queueName})`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[${consumerId}] handler error for event ${job?.id} on "${topic}":`,
      err,
    );
  });

  worker.on("error", (err) => {
    console.error(`[${consumerId}] worker error on "${topic}":`, err);
  });

  return worker;
};
