import type { MongoRepository } from "typeorm";
import type { Stock } from "./models/Stock.model.js";

const DEFAULT_INITIAL_STOCK = Number(
  process.env.INVENTORY_DEFAULT_STOCK ?? 100,
);

export interface ReservationItem {
  productId: string;
  quantity: number;
}

export interface ReservationFailure {
  productId: string;
  requested: number;
  available: number;
}

export class StockService {
  private readonly _stockRepository: MongoRepository<Stock>;

  constructor(stockRepository: MongoRepository<Stock>) {
    this._stockRepository = stockRepository;
  }

  public reserve = async (
    items: ReservationItem[],
  ): Promise<{ ok: boolean; failures: ReservationFailure[] }> => {
    const failures: ReservationFailure[] = [];
    const applied: ReservationItem[] = [];

    for (const item of items) {
      const current = await this.ensureStock(item.productId);

      if (current.quantity < item.quantity) {
        failures.push({
          productId: item.productId,
          requested: item.quantity,
          available: current.quantity,
        });
        continue;
      }

      await this._stockRepository.updateOne(
        { productId: item.productId },
        { $inc: { quantity: -item.quantity } },
      );
      applied.push(item);
    }

    if (failures.length > 0) {
      for (const item of applied) {
        await this._stockRepository.updateOne(
          { productId: item.productId },
          { $inc: { quantity: item.quantity } },
        );
      }
      return { ok: false, failures };
    }

    return { ok: true, failures: [] };
  };

  public getStock = async (productId: string): Promise<Stock> =>
    this.ensureStock(productId);

  private ensureStock = async (productId: string): Promise<Stock> => {
    const existing = await this._stockRepository.findOneBy({ productId });
    if (existing) {
      return existing;
    }

    await this._stockRepository.insertOne({
      productId,
      quantity: DEFAULT_INITIAL_STOCK,
    });

    const created = await this._stockRepository.findOneBy({ productId });
    if (!created) {
      throw new Error(`failed to initialize stock for ${productId}`);
    }
    return created;
  };
}
