import type { Repository } from "typeorm";
import type { Product } from "../models/Product.model.js";
import { BadRequestError, NotFoundError } from "../types/Error.js";
import type { ProductType } from "../schemas/Product.schema.js";
import { OrderItem } from "../models/OrderItem.model.js";

class ProductService {
  private readonly _productRepository: Repository<Product>;

  constructor(productRepository: Repository<Product>) {
    this._productRepository = productRepository;
  }

  public getProducts = async () => {
    return this._productRepository.find({
      relations: ["category"],
    });
  };

  public getProductById = async (id: string) => {
    const product = await this._productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  };

  public createProduct = async (payload: Omit<ProductType, "id">) => {
    const { name, price, description, categoryId } = payload;

    if (price <= 0) {
      throw new BadRequestError("Invalid price");
    }

    const product = this._productRepository.create({
      name,
      price,
      description,
      categoryId,
    });

    return this._productRepository.save(product);
  };

  public updateProduct = async (
    id: string,
    payload: Partial<Omit<ProductType, "id">>,
  ) => {
    const product = await this._productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const { name, price, description, categoryId } = payload;

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.categoryId = categoryId ?? product.categoryId;

    return this._productRepository.save(product);
  };

  public deleteProduct = async (id: string) => {
    const result = await this._productRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundError("Product not found");
    }
  };

  public getTopNProductsByRevenue = async (limit = 10) =>
    this._productRepository
      .createQueryBuilder("product")
      .leftJoin(OrderItem, "item", "item.productId = product.id")
      .select("product.id", "id")
      .addSelect("product.name", "name")
      .addSelect("product.price", "price")
      .addSelect(
        "COALESCE(SUM(item.quantity * item.purchasePrice), 0)",
        "totalRevenue",
      )
      .addSelect("COALESCE(SUM(item.quantity), 0)", "totalUnitsSold")
      .groupBy("product.id")
      .orderBy("SUM(item.quantity * item.purchasePrice)", "DESC")
      .limit(limit)
      .getRawMany();
}

export default ProductService;
