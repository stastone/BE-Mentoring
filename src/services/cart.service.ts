import type { MongoRepository } from "typeorm";
import { Cart, CartItem } from "../models/Cart.model.js";
import { NotFoundError } from "../types/Error.js";

class CartService {
  private readonly _cartRepository: MongoRepository<Cart>;

  constructor(cartRepository: MongoRepository<Cart>) {
    this._cartRepository = cartRepository;
  }

  public getCartByUserId = async (userId: string) => {
    const cart = await this._cartRepository.findOne({ where: { userId } });

    if (!cart) {
      return { userId, items: [] as CartItem[] };
    }

    return cart;
  };

  public addItem = async (
    userId: string,
    productId: string,
    quantity: number,
  ) => {
    let cart = await this._cartRepository.findOne({ where: { userId } });

    if (!cart) {
      cart = this._cartRepository.create({
        userId,
        items: [],
        updatedAt: new Date(),
      });
    }

    const existingItem = cart.items.find((i) => i.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const item = new CartItem();
      item.productId = productId;
      item.quantity = quantity;
      item.addedAt = new Date();
      cart.items.push(item);
    }

    cart.updatedAt = new Date();
    return this._cartRepository.save(cart);
  };

  public updateItemQuantity = async (
    userId: string,
    productId: string,
    quantity: number,
  ) => {
    const cart = await this._cartRepository.findOne({ where: { userId } });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      throw new NotFoundError("Item not found in cart");
    }

    item.quantity = quantity;
    cart.updatedAt = new Date();
    return this._cartRepository.save(cart);
  };

  public removeItem = async (userId: string, productId: string) => {
    const cart = await this._cartRepository.findOne({ where: { userId } });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const itemIndex = cart.items.findIndex((i) => i.productId === productId);

    if (itemIndex === -1) {
      throw new NotFoundError("Item not found in cart");
    }

    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date();
    return this._cartRepository.save(cart);
  };

  public clearCart = async (userId: string) => {
    const cart = await this._cartRepository.findOne({ where: { userId } });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    cart.items = [];
    cart.updatedAt = new Date();
    return this._cartRepository.save(cart);
  };
}

export default CartService;
