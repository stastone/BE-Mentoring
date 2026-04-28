import type { MongoRepository } from "typeorm";
import { Notification } from "./models/Notification.model.js";
import type { NotificationInput } from "./types.js";

export class NotificationService {
  private readonly _notificationRepository: MongoRepository<Notification>;

  constructor(notificationRepository: MongoRepository<Notification>) {
    this._notificationRepository = notificationRepository;
  }

  public send = async (input: NotificationInput): Promise<void> => {
    const createdAt = new Date();
    console.log(
      `[notifications] email → ${input.recipient} | ${input.subject} (${input.kind})`,
    );
    await this._notificationRepository.insertOne({
      ...input,
      createdAt,
    });
  };
}
