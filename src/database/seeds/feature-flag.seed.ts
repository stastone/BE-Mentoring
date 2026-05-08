import { faker } from "@faker-js/faker";
import type { EntityManager } from "typeorm";
import { FeatureFlag } from "../../models/FeatureFlag.model.js";

export async function seedFeatureFlags(manager: EntityManager) {
  return manager.create(FeatureFlag, {
    name: "user-preferences-analytics",
    enabled: faker.datatype.boolean(),
    description: "Enables analytics for user preferences",
  });
}
