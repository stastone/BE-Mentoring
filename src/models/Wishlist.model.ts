import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

export class WishlistItem {
  productId!: string;
  addedAt!: Date;
  priority!: number;
}

@Entity()
export class Wishlist {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  items!: WishlistItem[];

  @Column({ nullable: true })
  cartId?: string | null;

  @Column()
  updatedAt!: Date;
}
