import { Column, Entity, Index, ObjectIdColumn } from "typeorm";

@Entity("events")
@Index(["topic", "seq"], { unique: true })
export class Event {
  @ObjectIdColumn()
  _id!: string;

  @Column()
  topic!: string;

  @Column()
  seq!: number;

  @Column()
  payload!: unknown;

  @Column()
  createdAt!: Date;
}
