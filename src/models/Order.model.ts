import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.model.js";

@Entity()
class Order {
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Column()
  public status: "pending" | "completed" | "cancelled" = "pending";

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "userId" })
  public user!: User;

  @Column()
  public userId!: string;
}

export default Order;
