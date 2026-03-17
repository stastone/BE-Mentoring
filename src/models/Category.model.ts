import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { CategoryType } from "../schemas/Category.schema.js";

@Entity()
export class Category implements CategoryType {
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Column()
  public name!: string;

  @Column({ type: "text", nullable: true })
  public parentCategoryId!: string | null;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "parentCategoryId" })
  parent!: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];
}
