import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category.model.js";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Column()
  public name!: string;

  @Column()
  public price!: number;

  @Column({ type: "text", nullable: true })
  public description?: string | null;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: "categoryId" })
  public category!: Category;

  @Column()
  public categoryId!: string;
}
