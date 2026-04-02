import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

interface Preference {
  productId: string;
  purchaseCount: number;
  totalQuantityBought: number;
  maxWishlistPriority: number;
  wasWishlisted: boolean;
  preferenceScore: number;
}

@Entity()
export class UserPreferences {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  userId!: string;

  @Column({ nullable: true })
  preferences!: Preference[];
}
