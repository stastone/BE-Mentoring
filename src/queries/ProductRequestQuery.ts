import { Between, Like, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import type { FindManyOptions, FindOptionsWhere } from "typeorm";
import type { Product } from "../models/Product.model.js";
import { RequestQuery } from "./RequestQuery.js";

export interface ProductFilters {
  name?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class ProductRequestQuery extends RequestQuery<ProductFilters> {
  public getFilters(): ProductFilters {
    return {
      name: this.getStringParam("name"),
      categoryId: this.getStringParam("categoryId"),
      minPrice: this.getNumberParam("minPrice"),
      maxPrice: this.getNumberParam("maxPrice"),
    };
  }

  public toFindManyOptions(): FindManyOptions<Product> {
    const { limit, skip } = this.getPagination();
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
