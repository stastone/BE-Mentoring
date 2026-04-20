import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity("counters")
export class TopiCounter {
  @ObjectIdColumn()
  _id!: string;

  @Column()
  seq!: number;
}
