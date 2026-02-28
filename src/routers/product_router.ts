import { Router } from "express";
import ProductController from "../controllers/product_controller.ts";
import ProductService from "../services/product.service.ts";

import reviewRouter from "./review_router.ts";
import dataSource from "../DataSource.ts";
import type { Product } from "../models/Product.ts";
import { productPayloadValidator } from "../middlewares/product/productPayloadValidator.ts";

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
