import { Router } from 'express';
import CartController from '../../controllers/cart.controller.js';

class CartRouter {
  constructor() {
    this.cartRouter = Router();
    this.cartRouter.post('/', CartController.createCart);
    this.cartRouter.post('/:cid/products/:pid', CartController.addProductInCart);
    this.cartRouter.delete('/:cid/products/:pid', CartController.deleteProductInCart);
    this.cartRouter.get('/:id', CartController.getCart);
    this.cartRouter.get('/', CartController.getCarts);
    this.cartRouter.delete('/:id', CartController.deleteCart);
    this.cartRouter.post('/:cid/purchase', CartController.purchaseCart); 
  }

  getRouter() {
    return this.cartRouter; 
  }
}

export default new CartRouter();
