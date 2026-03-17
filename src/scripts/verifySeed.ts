import dataSource from "../DataSource.js";
import { Product } from "../models/Product.model.js";
import { Category } from "../models/Category.model.js";
import { User } from "../models/User.model.js";
import { Order } from "../models/Order.model.js";
import { OrderItem } from "../models/OrderItem.model.js";
import { Review } from "../models/Review.model.js";

const entityMap = {
  product: {
    entity: Product,
    relations: ["category"],
  },
  category: {
    entity: Category,
    relations: [],
  },
  user: {
    entity: User,
    relations: [],
  },
  order: {
    entity: Order,
    relations: ["user"],
  },
  orderItem: {
    entity: OrderItem,
    relations: ["order", "product"],
  },
  review: {
    entity: Review,
    relations: ["user", "product"],
  },
};

async function inspect(target: string) {
  await dataSource.initialize();

  const manager = dataSource.manager;

  const runInspection = async (key: keyof typeof entityMap) => {
    const config = entityMap[key];

    const rows = await manager.find(config.entity, {
      relations: config.relations,
    });

    console.log(`\n=== ${key.toUpperCase()} (${rows.length}) ===`);

    const simplified = rows.map((row: any) => {
      const copy: any = { ...row };

      for (const rel of config.relations) {
        if (copy[rel]) {
          copy[rel] = copy[rel].name || copy[rel].id;
        }
      }

      return copy;
    });

    console.table(simplified);
  };

  if (target === "all") {
    for (const key of Object.keys(entityMap) as (keyof typeof entityMap)[]) {
      await runInspection(key);
    }
  } else if (entityMap[target as keyof typeof entityMap]) {
    await runInspection(target as keyof typeof entityMap);
  } else {
    console.error("Unknown entity:", target);
  }

  await dataSource.destroy();
}

const target = process.argv[2] || "all";

inspect(target).catch((err) => {
  console.error(err);
  process.exit(1);
});
