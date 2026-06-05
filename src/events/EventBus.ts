import { EventEmitter } from "node:events";
import type { DomainEvents } from "./domainEvents.js";

type EventName = keyof DomainEvents;

type Listener<K extends EventName> = (
  payload: DomainEvents[K],
) => void | Promise<void>;

class EventBus {
  private readonly _emitter = new EventEmitter();

  public on = <K extends EventName>(event: K, listener: Listener<K>): this => {
    this._emitter.on(event, (payload: DomainEvents[K]) => {
      Promise.resolve()
        .then(() => listener(payload))
        .catch((err) =>
          console.error(`[event-bus] listener for "${event}" failed:`, err),
        );
    });
    return this;
  };

  public emit = <K extends EventName>(event: K, payload: DomainEvents[K]) => {
    this._emitter.emit(event, payload);
  };
}

export default EventBus;
