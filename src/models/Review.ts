import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product.js";
import { User } from "./User.js";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public content: string;

  @Column()
  public rating: number;

  @ManyToOne(() => Product)
  public productId: number;

  @ManyToOne(() => User)
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
