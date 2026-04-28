import { MongoRepository, MongoServerError } from "typeorm";
import type { TopicCounter } from "../models/TopicCounter.model.js";
import type { Event } from "../models/Event.model.js";
import { InternalServerError, NotFoundError } from "../../src/types/Error.js";

class EventService {
  private readonly _eventRepository: MongoRepository<Event>;
  private readonly _counterRepository: MongoRepository<TopicCounter>;

  constructor(
    eventRepository: MongoRepository<Event>,
    counterRepository: MongoRepository<TopicCounter>,
  ) {
    this._eventRepository = eventRepository;
    this._counterRepository = counterRepository;
  }

  public publish = async <T>(topic: string, eventId: string, payload: T) => {
    const seq = await this.incrementCounter(topic);

    try {
      await this._eventRepository.insertOne({
        _id: eventId,
        topic,
        seq,
        payload,
        createdAt: new Date(),
      });
      return { eventId, seq, duplicate: false };
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        return { eventId, duplicate: true };
      }
      throw error;
    }
  };

  public getNextEvent = async (topic: string, seq: number) => {
    return this._eventRepository.findOne({
      where: { topic, seq: { $gt: seq } },
      order: { seq: "ASC" },
    });
  };

  private incrementCounter = async (topic: string) => {
    const result = await this._counterRepository.findOneAndUpdate(
      { _id: topic },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" },
    );

    if (!result) {
      throw new InternalServerError("Error incrementing topic counter");
    }

    return result.value.seq;
  };

  public getCurrentSeq = async (topic: string) => {
    const counter = await this._counterRepository.findOneBy({ _id: topic });
    return counter?.seq ?? 0;
  };

  public getEventById = async (id: string) => {
    const event = await this._eventRepository.findOneBy({ _id: id });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    return event;
  };
}

export default EventService;
