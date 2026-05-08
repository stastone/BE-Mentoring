import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity("stock")
export class Stock {
  @ObjectIdColumn()
  _id!: string;

  @Column()
  productId!: string;

  @Column()
  quantity!: number;
}
