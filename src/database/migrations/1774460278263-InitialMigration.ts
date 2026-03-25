import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1774460278263 implements MigrationInterface {
  name = "InitialMigration1774460278263";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar NOT NULL, "refreshToken" text)`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "parentCategoryId" varchar)`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "price" integer NOT NULL, "description" text, "categoryId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "review" ("id" varchar PRIMARY KEY NOT NULL, "content" varchar NOT NULL, "rating" integer NOT NULL, "productId" varchar NOT NULL, "userId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" varchar PRIMARY KEY NOT NULL, "quantity" integer NOT NULL, "purchasePrice" integer NOT NULL, "productId" varchar NOT NULL, "orderId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar NOT NULL, "userId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_category" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "parentCategoryId" varchar, CONSTRAINT "FK_9e5435ba76dbc1f1a0705d4db43" FOREIGN KEY ("parentCategoryId") REFERENCES "category" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_category"("id", "name", "parentCategoryId") SELECT "id", "name", "parentCategoryId" FROM "category"`,
    );
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_category" RENAME TO "category"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_product" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "price" integer NOT NULL, "description" text, "categoryId" varchar NOT NULL, CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_product"("id", "name", "price", "description", "categoryId") SELECT "id", "name", "price", "description", "categoryId" FROM "product"`,
    );
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_product" RENAME TO "product"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_review" ("id" varchar PRIMARY KEY NOT NULL, "content" varchar NOT NULL, "rating" integer NOT NULL, "productId" varchar NOT NULL, "userId" varchar NOT NULL, CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_review"("id", "content", "rating", "productId", "userId") SELECT "id", "content", "rating", "productId", "userId" FROM "review"`,
    );
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_review" RENAME TO "review"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_order_item" ("id" varchar PRIMARY KEY NOT NULL, "quantity" integer NOT NULL, "purchasePrice" integer NOT NULL, "productId" varchar NOT NULL, "orderId" varchar NOT NULL, CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_order_item"("id", "quantity", "purchasePrice", "productId", "orderId") SELECT "id", "quantity", "purchasePrice", "productId", "orderId" FROM "order_item"`,
    );
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_order_item" RENAME TO "order_item"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_order" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar NOT NULL, "userId" varchar NOT NULL, CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_order"("id", "status", "userId") SELECT "id", "status", "userId" FROM "order"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`);
    await queryRunner.query(
      `CREATE TABLE "order" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar NOT NULL, "userId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "order"("id", "status", "userId") SELECT "id", "status", "userId" FROM "temporary_order"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_order"`);
    await queryRunner.query(
      `ALTER TABLE "order_item" RENAME TO "temporary_order_item"`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" varchar PRIMARY KEY NOT NULL, "quantity" integer NOT NULL, "purchasePrice" integer NOT NULL, "productId" varchar NOT NULL, "orderId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "order_item"("id", "quantity", "purchasePrice", "productId", "orderId") SELECT "id", "quantity", "purchasePrice", "productId", "orderId" FROM "temporary_order_item"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_order_item"`);
    await queryRunner.query(
      `ALTER TABLE "review" RENAME TO "temporary_review"`,
    );
    await queryRunner.query(
      `CREATE TABLE "review" ("id" varchar PRIMARY KEY NOT NULL, "content" varchar NOT NULL, "rating" integer NOT NULL, "productId" varchar NOT NULL, "userId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "review"("id", "content", "rating", "productId", "userId") SELECT "id", "content", "rating", "productId", "userId" FROM "temporary_review"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_review"`);
    await queryRunner.query(
      `ALTER TABLE "product" RENAME TO "temporary_product"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "price" integer NOT NULL, "description" text, "categoryId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "product"("id", "name", "price", "description", "categoryId") SELECT "id", "name", "price", "description", "categoryId" FROM "temporary_product"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_product"`);
    await queryRunner.query(
      `ALTER TABLE "category" RENAME TO "temporary_category"`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "parentCategoryId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "category"("id", "name", "parentCategoryId") SELECT "id", "name", "parentCategoryId" FROM "temporary_category"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_category"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
