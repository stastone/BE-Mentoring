import { Router } from "express";
import ProductController from "../controllers/product_controller.ts";
import ProductService from "../services/product/product.service.ts";
import ProductRepositoryService from "../services/product/product_repository.service.ts";
import { validateProductPayload } from "../middlewares/product/validateProductPayload.ts";

const productRouter = Router();

const productRepository = new ProductRepositoryService();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

productRouter
  .route("/:productId")
  .get(productController.getProductByIdRequestHandler)
  .put(validateProductPayload, productController.updateProductRequestHandler)
  .delete(productController.deleteProductRequestHandler);

productRouter
  .route("/")
  .get(productController.getProductsRequestHandler)
  .post(validateProductPayload, productController.createProductRequestHandler);

export default productRouter;
