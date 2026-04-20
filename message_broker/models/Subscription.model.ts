import { Column, Entity, ObjectIdColumn } from "typeorm";

type CurrentEvent = {
  eventId: string;
  seq: number;
  leaseUntil: Date;
};

@Entity("subscriptions")
export class Subscription {
  @ObjectIdColumn()
  _id!: string;

  @Column()
  consumerId!: string;

  @Column()
  topic!: string;

  @Column()
  offset!: number;

  @Column()
  currentEvent!: CurrentEvent | null;

  @Column()
  lastSeen!: Date;
}
