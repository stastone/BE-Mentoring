import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { ProductType } from "../schemas/Product.schema.js";

@Entity()
export class Product implements ProductType {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column()
  public price: number;

  @Column({ nullable: true })
  public description?: string | null;

  @Column()
  public category: string;

  constructor(
    id: string,
    name: string,
    price: number,
    category: string,
    description?: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.category = category;
  }

  public getProductInfo(): string {
    return `Product ID: ${this.id}, Name: ${this.name}, Price: ${this.price}, Description: ${this.description}, Category: ${this.category}`;
  }
}
