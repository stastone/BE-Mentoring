import { type RequestHandler } from "express";
import type { Product } from "../models/Product.ts";
import type ProductService from "../services/product.service.ts";
import {
  BaseController,
  type ResponsePayload,
} from "../utils/BaseController.ts";

export default class ProductController extends BaseController {
  private readonly productService: ProductService;
  constructor(productService: ProductService) {
    super();
    this.productService = productService;
  }

  getProductsRequestHandler: RequestHandler<
    null,
    ResponsePayload<Product[]>,
    null
  > = (_req, res) => {
    const products = this.productService.getProducts();

    this.ok(res, products);
  };

  getProductByIdRequestHandler: RequestHandler<
    { productId: string },
    ResponsePayload<Product>,
    null
  > = (req, res) => {
    const { productId } = req.params;
    const product = this.productService.getProductById(parseInt(productId, 10));

    this.ok(res, product);
  };

  createProductRequestHandler: RequestHandler<
    null,
    ResponsePayload<Product>,
    { name: string; price: number; description: string; category: string }
  > = (req, res) => {
    const { name, price, description, category } = req.body;
    const newProduct = this.productService.createProduct(
      name,
      price,
      description,
      category,
    );

    this.created(res, newProduct);
  };

  updateProductRequestHandler: RequestHandler<
    { productId: string },
    ResponsePayload<Product>,
    {
      newName?: string;
      newPrice?: number;
      newDescription?: string;
      newCategory?: string;
    }
  > = (req, res) => {
    const { productId } = req.params;
    const { newName, newPrice, newDescription, newCategory } = req.body;
    const productToUpdate = this.productService.getProductById(
      parseInt(productId, 10),
    );

    const updatedProduct = this.productService.updateProduct(
      productToUpdate.id,
      newName ?? productToUpdate.name,
      newPrice ?? productToUpdate.price,
      newDescription ?? productToUpdate.description,
      newCategory ?? productToUpdate.category,
    );

    this.ok(res, updatedProduct);
  };

  deleteProductRequestHandler: RequestHandler<
    { productId: string },
    ResponsePayload<null>,
    null
  > = (req, res) => {
    const { productId } = req.params;
    const productToDelete = this.productService.getProductById(
      parseInt(productId, 10),
    );

    this.productService.deleteProduct(productToDelete.id);

    this.ok(res, null);
  };
}
