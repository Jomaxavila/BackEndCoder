import { Router } from 'express';
import ProductController from '../../controllers/product.controller.js';

class ProductsRouter {
  constructor() {
    this.router = Router();

    this.router.get('/', ProductController.getAllProducts);
    this.router.get('/:id', ProductController.getProductById);
    this.router.post('/', ProductController.createProduct);
    this.router.put('/:id', ProductController.updateProduct);
    this.router.delete('/:id', ProductController.deleteProduct);
  }

  getRouter() {
    return this.router;
  }
}

export default new ProductsRouter();
