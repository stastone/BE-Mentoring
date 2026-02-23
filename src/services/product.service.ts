import type { Repository } from "typeorm";
import type { Product } from "../models/Product.ts";
import { BadRequestError, NotFoundError } from "../types/Error.ts";

export default class ProductService {
  private readonly _productRepository: Repository<Product>;

  constructor(productRepository: Repository<Product>) {
    this._productRepository = productRepository;
  }

  async getProducts() {
    return this._productRepository.find();
  }

  async getProductById(productId: number) {
    return this._productRepository.findOneBy({ id: productId });
  }

  async createProduct(
    name: string,
    price: number,
    description: string,
    category: string,
  ) {
    if (price <= 0) {
      throw new BadRequestError("Invalid price");
    }

    const product = this._productRepository.create({
      name,
      price,
      description,
      category,
    });

    return this._productRepository.save(product);
  }

  async updateProduct(
    productId: number,
    name: string,
    price: number,
    description: string,
    category: string,
  ) {
    const product = await this._productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;

    return this._productRepository.save(product);
  }

  async deleteProduct(productId: number) {
    const result = await this._productRepository.delete(productId);

    if (!result.affected) {
      throw new NotFoundError("Product not found");
    }
  }
}
