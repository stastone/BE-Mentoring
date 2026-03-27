import { type RequestHandler } from "express";
import type { Product } from "../../models/Product.model.js";
import type ProductService from "../../services/product.service.js";
import { BaseController, type ResponsePayload } from "../base.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";
import type { ProductType } from "../../schemas/Product.schema.js";

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
    const product = await this.productService.getProductById(productId);

    this.ok(res, product);
  });

  public createProductRequestHandler: RequestHandler<
    never,
    ResponsePayload<Product>,
    Omit<ProductType, "id">
  > = catchAsync(async (req, res) => {
    const { name, price, description, categoryId } = req.body;
    const newProduct = await this.productService.createProduct({
      name,
      price,
      description,
      categoryId,
    });

    this.created(res, newProduct);
  });

  public updateProductRequestHandler: RequestHandler<
    { productId: string },
    ResponsePayload<Product>,
    Partial<Omit<ProductType, "id">>
  > = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const {
      name: newName,
      price: newPrice,
      description: newDescription,
      categoryId: newCategoryId,
    } = req.body;

    const productToUpdate = await this.productService.getProductById(productId);

    const updatedProduct = await this.productService.updateProduct(
      productToUpdate.id,
      {
        name: newName ?? productToUpdate.name,
        price: newPrice ?? productToUpdate.price,
        categoryId: newCategoryId ?? productToUpdate.categoryId,
        description: newDescription ?? productToUpdate.description,
      },
    );

    this.ok(res, updatedProduct);
  });

  public deleteProductRequestHandler: RequestHandler<
    { productId: string },
    ResponsePayload<null>,
    null
  > = catchAsync(async (req, res) => {
    const { productId } = req.params;

    await this.productService.deleteProduct(productId);

    this.ok(res, null);
  });

  public getProductsRevenue: RequestHandler<
    { limit?: number },
    ResponsePayload<Product[]>,
    never
  > = catchAsync(async (req, res) => {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const topProducts =
      await this.productService.getTopNProductsByRevenue(limit);

    this.ok(res, topProducts);
  });
}

export default ProductController;
