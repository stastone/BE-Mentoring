export interface DeliveredEvent {
  _id: string;
  topic: string;
  seq: number;
  payload: unknown;
  createdAt: Date;
  leaseUntil: Date;
  redelivered: boolean;
}
