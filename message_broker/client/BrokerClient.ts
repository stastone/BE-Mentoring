import type { DeliveredEvent } from "../types/DeliveredEvent.js";
import type { PublishedEvent } from "../types/PublishedEvent.js";
import type { SubscriptionResult } from "../types/SubscriptionResult.js";

export class BrokerClient {
  private readonly _baseUrl: string = "http://localhost:3100";

  public publish = async <T>(topic: string, eventId: string, payload: T) => {
    const res = await fetch(
      `${this._baseUrl}/topics/${encodeURIComponent(topic)}/publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, payload }),
      },
    );
    return this.parseJsonData<PublishedEvent>(res, "publish");
  };

  public subscribe = async (
    consumerId: string,
    topic: string,
    fromStart = false,
  ) => {
    const res = await fetch(
      `${this._baseUrl}/topics/${encodeURIComponent(topic)}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consumerId, fromStart }),
      },
    );
    return this.parseJsonData<SubscriptionResult>(res, "subscribe");
  };

  public poll = async (consumerId: string, topic: string) => {
    const url = `${this._baseUrl}/topics/${encodeURIComponent(topic)}/poll?consumerId=${encodeURIComponent(consumerId)}`;
    const res = await fetch(url);

    if (res.status === 204) {
      return null;
    }

    return this.parseJsonData<DeliveredEvent>(res, "poll");
  };

  public acknowledge = async (
    consumerId: string,
    topic: string,
    eventId: string,
  ) => {
    const res = await fetch(
      `${this._baseUrl}/topics/${encodeURIComponent(topic)}/ack`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consumerId, eventId }),
      },
    );
    const body = (await res.json()) as { data?: { acknowledged?: boolean } };
    return body.data?.acknowledged === true;
  };

  private parseJsonData = async <T>(res: Response, op: string): Promise<T> => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`broker ${op} failed (${res.status}): ${text}`);
    }

    const body = (await res.json()) as { data: T };
    return body.data;
  };
}
