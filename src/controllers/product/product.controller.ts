import { type RequestHandler } from "express";
import type { Product } from "../../models/Product.js";
import type ProductService from "../../services/product.service.js";
import { BaseController, type ResponsePayload } from "../base.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";

class ProductController extends BaseController {
  private readonly productService: ProductService;
  constructor(productService: ProductService) {
    super();
    this.productService = productService;
  }

  public getProductsRequestHandler: RequestHandler<
    null,
    ResponsePayload<Product[]>,
    null
  > = catchAsync(async (_req, res) => {
    const products = await this.productService.getProducts();

    this.ok(res, products);
  });

  public getProductByIdRequestHandler: RequestHandler<
    { productId: string },
    ResponsePayload<Product>,
    null
  > = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const product = await this.productService.getProductById(
      parseInt(productId, 10),
    );

    this.ok(res, product);
  });

  public createProductRequestHandler: RequestHandler<
    null,
    ResponsePayload<Product>,
    { name: string; price: number; description: string; category: string }
  > = catchAsync(async (req, res) => {
    const { name, price, description, category } = req.body;
    const newProduct = await this.productService.createProduct(
      name,
      price,
      description,
      category,
    );

    this.created(res, newProduct);
  });

  public updateProductRequestHandler: RequestHandler<
    { productId: string },
    ResponsePayload<Product>,
    {
      newName?: string;
      newPrice?: number;
      newDescription?: string;
      newCategory?: string;
    }
  > = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const { newName, newPrice, newDescription, newCategory } = req.body;
    const productToUpdate = await this.productService.getProductById(
      parseInt(productId, 10),
    );

    const updatedProduct = await this.productService.updateProduct(
      productToUpdate.id,
      newName ?? productToUpdate.name,
      newPrice ?? productToUpdate.price,
      newCategory ?? productToUpdate.category,
      newDescription ?? productToUpdate.description,
    );

    this.ok(res, updatedProduct);
  });

  public deleteProductRequestHandler: RequestHandler<
    { productId: string },
    ResponsePayload<null>,
    null
  > = catchAsync(async (req, res) => {
    const { productId } = req.params;

    await this.productService.deleteProduct(parseInt(productId, 10));

    this.ok(res, null);
  });
}

export default ProductController;
