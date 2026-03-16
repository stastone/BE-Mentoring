import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.model.js";
import OrderItem from "./OrderItem.model.js";
import type { OrderType } from "../schemas/Order.schema.js";

@Entity()
class Order implements OrderType {
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Column()
  public status: "pending" | "completed" | "cancelled" = "pending";

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "userId" })
  public user!: User;

  @Column()
  public userId!: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  public items!: OrderItem[];
}

export default Order;
