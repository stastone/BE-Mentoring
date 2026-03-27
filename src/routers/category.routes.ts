import { Router } from "express";
import type { Category } from "../models/Category.model.js";
import CategoryService from "../services/category.service.js";
import { sqliteDataSource } from "../DataSource.js";
import CategoryController from "../controllers/category/category.controller.js";
import { validate } from "../middlewares/validateSchema.js";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../schemas/Category.schema.js";

const categoryRouter = Router();

const categoryRepository = sqliteDataSource.getRepository<Category>("Category");
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

categoryRouter
  .route("/")
  .get(categoryController.getCategoriesRequestHandler)
  .post(
    validate(CreateCategorySchema),
    categoryController.createCategoryRequestHandler,
  );

categoryRouter
  .route("/:categoryId")
  .get(categoryController.getCategoryByIdRequestHandler)
  .patch(
    validate(UpdateCategorySchema),
    categoryController.updateCategoryRequestHandler,
  )
  .delete(categoryController.deleteCategoryRequestHandler);

export default categoryRouter;
