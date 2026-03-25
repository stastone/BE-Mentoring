import { Router } from "express";
import ProductController from "../controllers/product/product.controller.js";
import ProductService from "../services/product.service.js";

import reviewRouter from "./review.routes.js";
import { sqliteDataSource } from "../DataSource.js";
import type { Product } from "../models/Product.model.js";
import { validate } from "../middlewares/validateSchema.js";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "../schemas/Product.schema.js";

const productRouter = Router();

const productRepository = sqliteDataSource.getRepository<Product>("Product");
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

productRouter
  .route("/:productId")
  .get(productController.getProductByIdRequestHandler)
  .patch(
    validate(UpdateProductSchema),
    productController.updateProductRequestHandler,
  )
  .delete(productController.deleteProductRequestHandler);

productRouter
  .route("/")
  .get(productController.getProductsRequestHandler)
  .post(
    validate(CreateProductSchema),
    productController.createProductRequestHandler,
  );

productRouter.use("/:productId/reviews", reviewRouter);

export default productRouter;
