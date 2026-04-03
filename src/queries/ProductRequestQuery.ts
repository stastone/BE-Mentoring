import { Between, Like, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import type { FindManyOptions, FindOptionsWhere } from "typeorm";
import type { Product } from "../models/Product.model.js";
import type { ProductQueryType } from "../schemas/queries/ProductRequestQuery.schema.js";
import { RequestQuery } from "./RequestQuery.js";

export interface ProductFilters {
  name?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class ProductRequestQuery extends RequestQuery<ProductFilters> {
  private readonly _parsedQuery: ProductQueryType;

  constructor(parsed: ProductQueryType) {
    super(parsed);
    this._parsedQuery = parsed;
  }

  public getFilters(): ProductFilters {
    return {
      name: this._parsedQuery.name,
      categoryId: this._parsedQuery.categoryId,
      minPrice: this._parsedQuery.minPrice,
      maxPrice: this._parsedQuery.maxPrice,
    };
  }

  public toFindManyOptions(): FindManyOptions<Product> {
    const { page, limit } = this._parsedQuery;
    const skip = (page - 1) * limit;
    const filters = this.getFilters();

    const where: FindOptionsWhere<Product> = {};

    if (filters.name) {
      where.name = Like(`%${filters.name}%`);
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    const priceFilter = this.applyPriceFilter(
      filters.minPrice,
      filters.maxPrice,
    );

    if (priceFilter.price) {
      Object.assign(where, priceFilter);
    }

    return {
      relations: ["category"],
      where,
      take: limit,
      skip,
      order: { name: "ASC" },
    };
  }

  private applyPriceFilter(
    minPrice?: number,
    maxPrice?: number,
  ): FindOptionsWhere<Product> {
    if (minPrice && maxPrice) {
      return { price: Between(minPrice, maxPrice) };
    }

    if (minPrice && !maxPrice) {
      return { price: MoreThanOrEqual(minPrice) };
    }

    if (!minPrice && maxPrice) {
      return { price: LessThanOrEqual(maxPrice) };
    }

    return {};
  }
}
