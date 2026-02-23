export class Review {
  public readonly id: number;
  public content: string;
  public rating: number;
  public productId: number;
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
