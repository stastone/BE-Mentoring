export interface PublishedEvent {
  eventId: string;
  seq?: number;
  duplicate: boolean;
}
