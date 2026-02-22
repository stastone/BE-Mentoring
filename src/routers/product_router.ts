import { Router } from "express";
import ProductController from "../controllers/product_controller.ts";
import ProductService from "../services/product.service.ts";

const productRouter = Router();

const productService = new ProductService();
const productController = new ProductController(productService);

productRouter
  .route("/:productId")
  .get(productController.getProductByIdRequestHandler)
  .put(productController.updateProductRequestHandler)
  .delete(productController.deleteProductRequestHandler);

productRouter
  .route("/")
  .get(productController.getProductsRequestHandler)
  .post(productController.createProductRequestHandler);

export default productRouter;
