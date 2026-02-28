import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public name: string;

  @Column()
  public price: number;

  @Column({ nullable: true })
  public description?: string;

  @Column()
  public category: string;

  constructor(
    id: number,
    name: string,
    price: number,
    category: string,
    description?: string,
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
