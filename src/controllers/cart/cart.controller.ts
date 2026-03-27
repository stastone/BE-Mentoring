import type { RequestHandler } from "express";
import type CartService from "../../services/cart.service.js";
import { BaseController, type ResponsePayload } from "../base.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";

class CartController extends BaseController {
  private readonly _cartService: CartService;

  constructor(cartService: CartService) {
    super();
    this._cartService = cartService;
  }

  public getCartRequestHandler: RequestHandler<
    { userId: string },
    ResponsePayload<unknown>
  > = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const cart = await this._cartService.getCartByUserId(userId);
    this.ok(res, cart);
  });

  public addItemRequestHandler: RequestHandler<
    { userId: string },
    ResponsePayload<unknown>,
    { productId: string; quantity: number }
  > = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    const cart = await this._cartService.addItem(userId, productId, quantity);
    this.ok(res, cart);
  });

  public updateItemQuantityRequestHandler: RequestHandler<
    { userId: string; productId: string },
    ResponsePayload<unknown>,
    { quantity: number }
  > = catchAsync(async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    const cart = await this._cartService.updateItemQuantity(
      userId,
      productId,
      quantity,
    );
    this.ok(res, cart);
  });

  public removeItemRequestHandler: RequestHandler<
    { userId: string; productId: string },
    ResponsePayload<null>
  > = catchAsync(async (req, res) => {
    const { userId, productId } = req.params;
    await this._cartService.removeItem(userId, productId);
    this.ok(res, null);
  });

  public clearCartRequestHandler: RequestHandler<
    { userId: string },
    ResponsePayload<null>
  > = catchAsync(async (req, res) => {
    const { userId } = req.params;
    await this._cartService.clearCart(userId);
    this.ok(res, null);
  });
}

export default CartController;
