import type ProductRepositoryService from "./product_repository.service.ts";

export default class ProductService {
  private readonly productRepositoryService: ProductRepositoryService;

  constructor(productRepositoryService: ProductRepositoryService) {
    this.productRepositoryService = productRepositoryService;
  }

  getProducts() {}

  getProductById(productId: number) {}

  createProduct(
    name: string,
    price: number,
    description: string,
    category: string,
  ) {}

  updateProduct(
    productId: number,
    name: string,
    price: number,
    description: string,
    category: string,
  ) {}

  deleteProduct(productId: number) {}
}
