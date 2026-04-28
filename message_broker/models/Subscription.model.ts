import { Column, Entity, ObjectIdColumn } from "typeorm";
import type { CurrentEvent } from "../types/CurrentEvent.js";

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
