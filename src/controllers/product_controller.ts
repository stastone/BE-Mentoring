import { type RequestHandler } from "express";

import { type ResponsePayload } from "../types/ResponsePayload.ts";
import type { Product } from "../models/Product.ts";

type ProductResponsePayload = ResponsePayload<Product | Product[]>;

export default class ProductController {
  private readonly productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  getProductsRequestHandler: RequestHandler<
    null,
    ProductResponsePayload,
    null
  > = (_req, res) => {
    const products = this.productService.getProducts();

    res
      .status(200)
      .json({ data: products, message: "Products retrieved successfully" });
  };

  getProductByIdRequestHandler: RequestHandler<
    { productId: string },
    ProductResponsePayload,
    null
  > = (req, res) => {
    const { productId } = req.params;
    const product = this.productService.getProductById(parseInt(productId, 10));

    if (!product) {
      return res.status(404).json({ data: null, message: "Product not found" });
    }

    res
      .status(200)
      .json({ data: product, message: "Product retrieved successfully" });
  };

  createProductRequestHandler: RequestHandler<
    null,
    ProductResponsePayload,
    { name: string; price: number; description: string; category: string }
  > = (req, res) => {
    const { name, price, description, category } = req.body;
    const newProduct = this.productService.createProduct(
      name,
      price,
      description,
      category,
    );

    res
      .status(201)
      .json({ data: newProduct, message: "Product created successfully" });
  };

  updateProductRequestHandler: RequestHandler<
    { productId: string },
    ProductResponsePayload,
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

    if (!productToUpdate) {
      return res.status(404).json({ data: null, message: "Product not found" });
    }

    const updatedProduct = this.productService.updateProduct(
      productToUpdate.id,
      newName ?? productToUpdate.name,
      newPrice ?? productToUpdate.price,
      newDescription ?? productToUpdate.description,
      newCategory ?? productToUpdate.category,
    );

    res
      .status(200)
      .json({ data: updatedProduct, message: "Product updated successfully" });
  };

  deleteProductRequestHandler: RequestHandler<
    { productId: string },
    ProductResponsePayload,
    null
  > = (req, res) => {
    const { productId } = req.params;
    const productToDelete = this.productService.getProductById(
      parseInt(productId, 10),
    );

    if (!productToDelete) {
      return res.status(404).json({ data: null, message: "Product not found" });
    }

    this.productService.deleteProduct(productToDelete.id);

    res
      .status(200)
      .json({ data: null, message: "Product deleted successfully" });
  };
}
