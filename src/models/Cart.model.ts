import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

export class CartItem {
  productId!: string;
  quantity!: number;
  addedAt!: Date;
}

@Entity()
export class Cart {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  items!: CartItem[];

  @Column()
  updatedAt!: Date;
}
