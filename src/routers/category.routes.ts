import { Router } from "express";
import type { Category } from "../models/Category.model.js";
import CategoryService from "../services/category.service.js";
import dataSource from "../DataSource.js";
import CategoryController from "../controllers/category/category.controller.js";

const categoryRouter = Router();

const categoryRepository = dataSource.getRepository<Category>("Category");
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

categoryRouter
  .route("/")
  .get(categoryController.getCategoriesRequestHandler)
  .post(categoryController.createCategoryRequestHandler);

categoryRouter
  .route("/:categoryId")
  .get(categoryController.getCategoryByIdRequestHandler)
  .patch(categoryController.updateCategoryRequestHandler)
  .delete(categoryController.deleteCategoryRequestHandler);

export default categoryRouter;
