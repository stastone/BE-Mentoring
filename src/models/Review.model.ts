import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product.model.js";
import { User } from "./User.model.js";

@Entity()
export class Review {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public content: string;

  @Column()
  public rating: number;

  @ManyToOne(() => Product)
  public productId: number;

  @ManyToOne(() => User)
  public userId: number;

  constructor(
    id: string,
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
