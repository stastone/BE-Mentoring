import type { UpdateResult } from "mongodb";
import { MongoRepository } from "typeorm";
import type { Subscription } from "../models/Subscription.model.js";
import { InternalServerError, NotFoundError } from "../../src/types/Error.js";
import type { CurrentEvent } from "../types/CurrentEvent.js";

class SubscriptionService {
  private readonly _subscriptionRepository: MongoRepository<Subscription>;
  constructor(subscriptionRepository: MongoRepository<Subscription>) {
    this._subscriptionRepository = subscriptionRepository;
  }

  public getSubscriptionByKey = async (consumerId: string, topic: string) => {
    const subscription = await this._subscriptionRepository.findOneBy({
      _id: this.subscriptionKey(consumerId, topic),
    });

    if (!subscription) {
      throw new NotFoundError("Subscription not found");
    }

    return subscription;
  };

  public createSubscription = async (
    consumerId: string,
    topic: string,
    offset: number,
  ) => {
    const newSubscription = await this._subscriptionRepository.insertOne({
      _id: this.subscriptionKey(consumerId, topic),
      consumerId,
      topic,
      offset,
      currentEvent: null,
      lastSeen: new Date(),
    });

    if (!newSubscription) {
      throw new InternalServerError("Failed to create subscription");
    }

    return newSubscription;
  };

  public seeEvent = async (consumerId: string, topic: string) =>
    this._subscriptionRepository.updateOne(
      { _id: this.subscriptionKey(consumerId, topic) },
      { $set: { lastSeen: new Date() } },
    );

  public setCurrentEventIfIdle = async (
    consumerId: string,
    topic: string,
    currentEvent: CurrentEvent,
  ) => {
    const result = (await this._subscriptionRepository.updateOne(
      { _id: this.subscriptionKey(consumerId, topic), currentEvent: null },
      { $set: { currentEvent: currentEvent, lastSeen: new Date() } },
    )) as UpdateResult;
    return result.modifiedCount === 1;
  };

  public extendLease = async (
    consumerId: string,
    topic: string,
    eventId: string,
    leaseUntil: Date,
  ): Promise<void> => {
    await this._subscriptionRepository.updateOne(
      {
        _id: this.subscriptionKey(consumerId, topic),
        "currentEvent.eventId": eventId,
      },
      {
        $set: {
          "currentEvent.leaseUntil": leaseUntil,
          lastSeen: new Date(),
        },
      },
    );
  };

  public acknowledgeEvent = async (
    consumerId: string,
    topic: string,
    eventId: string,
    ackSeq: number,
  ) => {
    const result = (await this._subscriptionRepository.updateOne(
      {
        _id: this.subscriptionKey(consumerId, topic),
        "currentEvent.eventId": eventId,
      },
      {
        $set: {
          offset: ackSeq,
          currentEvent: null,
          lastSeen: new Date(),
        },
      },
    )) as UpdateResult;
    return result.modifiedCount === 1;
  };

  private subscriptionKey = (consumerId: string, topic: string): string =>
    `${consumerId}::${topic}`;
}

export default SubscriptionService;
