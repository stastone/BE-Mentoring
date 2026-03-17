import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product.model.js";
import { User } from "./User.model.js";
import type { ReviewType } from "../schemas/Review.schema.js";

@Entity()
export class Review implements ReviewType {
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Column()
  public content!: string;

  @Column()
  public rating!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column()
  productId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;
}
