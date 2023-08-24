import { Router } from 'express';
import ProductController from '../controllers/product.controller.js';

const router = Router();
const productController = new ProductController(); 

class ProductRouter {
  constructor() {
    this.productRouter = Router();
    this.productRouter.get('/', productController.getAllProducts);
    this.productRouter.get('/', productController.getProducts);
    this.productRouter.post('/', productController.createProduct);
    this.productRouter.get('/:id', productController.getProductById);
    this.productRouter.put('/:id', productController.updateProduct);
    this.productRouter.delete('/:id', productController.deleteProduct);
  }

  getRouter() {
    return this.productRouter;
  }
}

export default new ProductRouter();