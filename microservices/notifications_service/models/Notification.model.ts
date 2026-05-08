import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity("notifications")
export class Notification {
  @ObjectIdColumn()
  _id!: string;

  @Column()
  topic!: string;

  @Column()
  eventId!: string;

  @Column()
  kind!: string;

  @Column()
  recipient!: string;

  @Column()
  subject!: string;

  @Column()
  body!: string;

  @Column()
  createdAt!: Date;
}
