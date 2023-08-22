import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';

const router = Router();
const cartController = new CartController(); 

class CartRouter {
  constructor() {
    this.cartRouter = Router();
    this.cartRouter.post('/', cartController.createCart);
    this.cartRouter.post('/:cid/products/:pid', cartController.addProductInCart);
    this.cartRouter.delete('/:cid/products/:pid', cartController.deleteProductInCart);
    this.cartRouter.get('/:id', cartController.getCart);
    this.cartRouter.get('/', cartController.getCarts);
    this.cartRouter.delete('/:id', cartController.deleteCart);
  }

  getRouter() {
    return this.cartRouter;
  }
}

export default new CartRouter();
