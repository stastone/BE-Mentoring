import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product.model.js";
import Order from "./Order.model.js";

@Entity()
class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Column()
  public quantity!: number;

  @Column()
  public purchasePrice!: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: "productId" })
  public product!: Product;

  @Column()
  public productId!: string;

  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: "orderId" })
  public order!: Order;

  @Column()
  public orderId!: string;
}

export default OrderItem;
