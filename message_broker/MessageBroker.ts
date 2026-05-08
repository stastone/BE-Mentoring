import type EventService from "./services/Event.service.js";
import type SubscriptionService from "./services/Subscription.service.js";
import type { DeliveredEvent } from "./types/DeliveredEvent.js";
import { NotSubscribedError } from "./types/Error.js";
import { Event } from "./models/Event.model.js";

const VISIBILITY_TIMEOUT_MS = Number(
  process.env.BROKER_VISIBILITY_TIMEOUT_MS ?? 30_000,
);

export class MessageBroker {
  private readonly _eventService: EventService;
  private readonly _subscriptionService: SubscriptionService;

  constructor(
    eventService: EventService,
    subscriptionService: SubscriptionService,
  ) {
    this._eventService = eventService;
    this._subscriptionService = subscriptionService;
  }

  public publish = (topic: string, eventId: string, payload: unknown) =>
    this._eventService.publish(topic, eventId, payload);

  public subscribe = async (
    consumerId: string,
    topic: string,
    fromStart = false,
  ) => {
    const existing = await this._subscriptionService.getSubscriptionByKey(
      consumerId,
      topic,
    );

    if (existing) {
      await this._subscriptionService.seeEvent(consumerId, topic);
      return { offset: existing.offset, created: false };
    }

    const startOffset = fromStart
      ? 0
      : await this._eventService.getCurrentSeq(topic);

    await this._subscriptionService.createSubscription(
      consumerId,
      topic,
      startOffset,
    );

    return { offset: startOffset, created: true };
  };

  public claimNext = async (consumerId: string, topic: string) => {
    const subscription = await this._subscriptionService.getSubscriptionByKey(
      consumerId,
      topic,
    );

    if (!subscription) {
      throw new NotSubscribedError(consumerId, topic);
    }

    const now = new Date();
    const leaseUntil = new Date(now.getTime() + VISIBILITY_TIMEOUT_MS);

    if (subscription.currentEvent) {
      const event = await this._eventService.getEventById(
        subscription.currentEvent.eventId,
      );

      if (!event) {
        throw new Error("broker invariant: inflight event missing");
      }

      const redelivered =
        subscription.currentEvent.leaseUntil.getTime() < now.getTime();
      await this._subscriptionService.extendLease(
        consumerId,
        topic,
        event._id,
        leaseUntil,
      );
      return this.toDelivered(event, leaseUntil, redelivered);
    }

    const nextEvent = await this._eventService.getNextEvent(
      topic,
      subscription.offset,
    );

    if (!nextEvent) {
      return null;
    }

    const currentEvent = {
      eventId: nextEvent._id,
      seq: nextEvent.seq,
      leaseUntil,
    };

    const claimed = await this._subscriptionService.setCurrentEventIfIdle(
      consumerId,
      topic,
      currentEvent,
    );

    if (!claimed) {
      return null;
    }

    return this.toDelivered(nextEvent, leaseUntil, false);
  };

  public acknowledgeEvent = async (
    consumerId: string,
    topic: string,
    eventId: string,
  ) => {
    const subscription = await this._subscriptionService.getSubscriptionByKey(
      consumerId,
      topic,
    );

    if (
      !subscription ||
      !subscription.currentEvent ||
      subscription.currentEvent.eventId !== eventId
    ) {
      return false;
    }

    return this._subscriptionService.acknowledgeEvent(
      consumerId,
      topic,
      eventId,
      subscription.currentEvent.seq,
    );
  };

  private toDelivered = (
    event: Event,
    leaseUntil: Date,
    redelivered: boolean,
  ) => ({
    _id: event._id,
    topic: event.topic,
    seq: event.seq,
    payload: event.payload,
    createdAt: event.createdAt,
    leaseUntil,
    redelivered,
  });
}
