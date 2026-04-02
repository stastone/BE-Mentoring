import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class CartCheckoutSession {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  cartId!: string;

  @Column({ nullable: true })
  wishlistId?: string | null;

  @Column()
  status!: "initiated" | "completed" | "cancelled";

  @Column()
  startedAt!: Date;

  @Column({ nullable: true })
  completedAt?: Date | null;
}
