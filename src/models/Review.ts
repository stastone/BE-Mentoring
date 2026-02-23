import { Column, Entity, ForeignKey, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product.ts";
import { User } from "./User.ts";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public content: string;

  @Column()
  public rating: number;

  @ForeignKey(() => Product)
  public productId: number;

  @ForeignKey(() => User)
  public userId: number;

  constructor(
    id: number,
    content: string,
    rating: number,
    productId: number,
    userId: number,
  ) {
    this.id = id;
    this.content = content;
    this.rating = rating;
    this.productId = productId;
    this.userId = userId;
  }
}
