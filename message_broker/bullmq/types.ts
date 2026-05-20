// Event shape handed to consumer handlers. Mirrors the old DeliveredEvent
// closely so handler code barely changes: BullMQ owns the lease/ack now, so
// leaseUntil is gone and `redelivered` comes from the job's attempt count.
export interface BrokerEvent {
  _id: string;
  topic: string;
  payload: unknown;
  redelivered: boolean;
  attemptsMade: number;
}

// Job payload stored in Redis for every enqueued event.
export interface BrokerJobData {
  topic: string;
  eventId: string;
  payload: unknown;
}
