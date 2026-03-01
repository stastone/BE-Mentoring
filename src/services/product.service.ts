import type { Repository } from "typeorm";
import type { Product } from "../models/Product.ts";
import { BadRequestError, NotFoundError } from "../types/Error.ts";

class ProductService {
  private readonly _productRepository: Repository<Product>;

  constructor(productRepository: Repository<Product>) {
    this._productRepository = productRepository;
  }

  public getProducts = async () => {
    return this._productRepository.find();
  };

  public getProductById = async (productId: number) => {
    const product = await this._productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  };

  public createProduct = async (
    name: string,
    price: number,
    description: string,
    category: string,
  ) => {
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
  };

  public updateProduct = async (
    productId: number,
    name: string,
    price: number,
    category: string,
    description?: string,
  ) => {
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
  };

  public deleteProduct = async (productId: number) => {
    const result = await this._productRepository.delete(productId);

    if (!result.affected) {
      throw new NotFoundError("Product not found");
    }
  };
}

export default ProductService;
