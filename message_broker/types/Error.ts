import { BaseError } from "../../src/types/Error.js";

export class NotSubscribedError extends BaseError {
  constructor(consumerId: string, topic: string) {
    super(`consumer ${consumerId} is not subscribed to topic ${topic}`, 403);
  }
}
