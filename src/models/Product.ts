export class Product {
  public readonly id: number;
  public name: string;
  public price: number;
  public description?: string;
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
