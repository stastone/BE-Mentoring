import { Router } from "express";
import ProductController from "../controllers/product/product.controller.js";
import ProductService from "../services/product.service.js";

import reviewRouter from "./review.routes.js";
import dataSource from "../DataSource.js";
import type { Product } from "../models/Product.js";
import { productPayloadValidator } from "../middlewares/product/productPayloadValidator.js";

const productRouter = Router();

const productRepository = dataSource.getRepository<Product>("Product");
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

productRouter
  .route("/:productId")
  .get(productController.getProductByIdRequestHandler)
  .put(productPayloadValidator, productController.updateProductRequestHandler)
  .delete(productController.deleteProductRequestHandler);

productRouter
  .route("/")
  .get(productController.getProductsRequestHandler)
  .post(productPayloadValidator, productController.createProductRequestHandler);

productRouter.use("/:productId/reviews", reviewRouter);

export default productRouter;
