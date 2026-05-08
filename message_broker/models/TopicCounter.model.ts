import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity("counters")
export class TopicCounter {
  @ObjectIdColumn()
  _id!: string;

  @Column()
  seq!: number;
}
