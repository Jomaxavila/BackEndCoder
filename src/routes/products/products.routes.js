import { Router } from 'express';
import customError from '../../services/errors/customError.js';
import EError from '../../services/errors/enums.js';
import ProductController from '../../controllers/product.controller.js';
import { addLogger } from '../../Utils/logger.js';


class ProductsRouter {
  constructor() {
    this.productRouter = Router();

    this.productRouter.get('/', addLogger, async (req, res) => {
      try {
        req.logger.info('Obteniendo todos los productos');
        
        const products = await ProductController.getAllProducts(req, res);
        res.json({ status: 'success', payload: products });
      } catch (error) {
        req.logger.warn('Hubo un problema al obtener productos');
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
      }
    });
    
    this.productRouter.get('/:id', addLogger, async (req, res) => {
      const productId = req.params.id;
      try {
        req.logger.info(`Obteniendo producto con ID: ${productId}`);
        const product = await ProductController.getProductById(req, res, productId);
        if (product) {
          res.json({ status: 'success', payload: product });
        } 
      } catch (error) {
       
        req.logger.warn(`Hubo un problema al obtener el producto con ID ${productId}`);
        res.status(500).json({ status: 'error', message: 'Error al obtener el producto', error: error.message });
      }
    });
    
    this.productRouter.post('/', addLogger, async (req, res) => {
      const { title, description, price, status, code, category, thumbnail, quantity, owner } = req.body;
  
      try {
          if (!title || !description || !price || !status || !code || !category || !thumbnail || !quantity || !owner) {
              throw customError.createError({
                  name: 'Error al crear el producto',
                  message: 'Fallo el intento de crear el producto',
                  code: EError.INVALID_TYPES_ERROR,
              });
          }
  
          const newProduct = {
              title,
              description,
              price,
              status,
              code,
              category,
              thumbnail,
              quantity,
              owner
          };
  
          const response = await ProductController.createProduct(req, res, newProduct);
  
          // Puedes enviar una respuesta exitosa aquí si es necesario
          res.json({ status: 'success', payload: response });
  
      } catch (error) {
          // No es necesario enviar una respuesta de error aquí,
          // Express se encargará de manejarla automáticamente
          req.logger.warn('Hubo un problema al crear el producto');
      }
  });
  
    

    this.productRouter.put('/:id', addLogger, async (req, res) => {
      const productId = req.params.id;
      const updatedProduct = req.body;
    
      try {
        const response = await ProductController.updateProduct(req, res, productId, updatedProduct);
        res.json({ status: 'success', payload: response });
      } catch (error) {
        req.logger.warn('Hubo un problema al actualizar el producto:', error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el producto', error: error.message });
      }
    });
    

    this.productRouter.delete('/:id', addLogger, async (req, res) => {
      const productId = req.params.id;
    
      try {
        const response = await ProductController.deleteProduct(req, res, productId);
      } catch (error) {

        req.logger.warn('Hubo un problema al eliminar el producto');
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto', error: error.message });
      }
    });
  }

  getRouter() {
    return this.productRouter;
  }
}

export default new ProductsRouter();
