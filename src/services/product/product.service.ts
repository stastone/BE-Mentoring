import type ProductRepositoryService from "./product_repository.service.ts";

export default class ProductService {
  private readonly productRepositoryService: ProductRepositoryService;

  constructor(productRepositoryService: ProductRepositoryService) {
    this.productRepositoryService = productRepositoryService;
  }
}
