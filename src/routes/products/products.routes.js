import { Router } from 'express';
import ProductController from '../../controllers/product.controller.js';
import CustomError from '../../services/errors/CustomError.js';
import EError from '../../services/errors/enums.js';

class ProductsRouter {
  constructor() {
    this.router = Router();

    this.router.get('/', async (req, res, next) => {
      try {
        const products = await ProductController.getAllProducts();
        res.status(200).json({
          status: 'success',
          data: products,
        });
      } catch (error) {
    
        const customError = new CustomError({
          name: 'ProductError',
          cause: error,
          message: 'Error al obtener todos los productos',
          code: EError.PRODUCT_NOT_FOUND,
        });
        next(customError);
      }
    });

    this.router.get('/:id', async (req, res, next) => {
      try {
        const productId = req.params.id;
        const product = await ProductController.getProductById(productId);

        if (!product) {
     
          const customError = new CustomError({
            name: 'ProductError',
            message: 'Producto no encontrado',
            code: EError.PRODUCT_NOT_FOUND,
          });
          throw customError;
        }

        res.status(200).json({
          status: 'success',
          data: product,
        });
      } catch (error) {
     
        next(error);
      }
    });

    this.router.post('/', async (req, res, next) => {
      try {
        const product = req.body;
        const response = await ProductController.createProduct(product);
        res.status(response.code).json({
          status: response.status,
          message: response.message,
        });
      } catch (error) {
       
        const customError = new CustomError({
          name: 'ProductError',
          cause: error,
          message: 'Error al crear un producto',
          code: EError.PRODUCT_CREATION_ERROR,
        });
        next(customError);
      }
    });

    this.router.put('/:id', async (req, res, next) => {
      try {
        const productId = req.params.id;
        const updatedProduct = req.body;
        await ProductController.updateProduct(productId, updatedProduct);
        res.status(200).send('Producto actualizado');
      } catch (error) {
      
        const customError = new CustomError({
          name: 'ProductError',
          cause: error,
          message: 'Error al actualizar un producto',
          code: EError.PRODUCT_UPDATE_ERROR,
        });
        next(customError);
      }
    });

    this.router.delete('/:id', async (req, res, next) => {
      try {
        const productId = req.params.id;
        const result = await ProductController.deleteProduct(productId);
        if (result.message) {
          res.status(200).send('Producto eliminado');
          console.log('Producto eliminado');
        } else {
          res.status(404).send('Producto no encontrado');
        }
      } catch (error) {
        const customError = new CustomError({
          name: 'ProductError',
          cause: error,
          message: 'Error al eliminar un producto',
          code: EError.PRODUCT_DELETION_ERROR,
        });
        next(customError);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new ProductsRouter();
