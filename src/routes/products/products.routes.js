import { Router } from 'express';
import customError from '../../services/errors/customError.js';
import EError from '../../services/errors/enums.js';
import ProductController from '../../controllers/product.controller.js';

class ProductsRouter {
  constructor() {
    this.productRouter = Router();

    this.productRouter.get('/', async (req, res) => {
      try {
        const products = await ProductController.getAllProducts(req, res);
        res.json({ status: 'success', payload: products });
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
      }
    });

    this.productRouter.get('/:id', async (req, res) => {
      const productId = req.params.id;
      try {
        const product = await ProductController.getProductById(req, res, productId);
        if (product) {
          res.json({ status: 'success', payload: product });
        } else {
          res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener el producto', error: error.message });
      }
    });

    this.productRouter.post('/', async (req, res) => {
      const { title, description, price, status, code, stock, category, thumbnail, quantity } = req.body;
    
      try {
        if (!title || !description || !price || !status || !code || !stock || !category || !thumbnail || !quantity) {
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
          stock,
          category,
          thumbnail,
          quantity
        };
    
        const response = await ProductController.createProduct(req, res, newProduct);
    
        if (response.code === 202) {
          res.json({ status: 'success', payload: response.message });
        } else {
          res.status(response.code).json({ status: 'error', message: response.message });
        }
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear el producto', error: error.message });
      }
    });

    this.productRouter.put('/:id', async (req, res) => {
      const productId = req.params.id;
      const updatedProduct = req.body;
    
      try {
        const response = await ProductController.updateProduct(req, res, productId, updatedProduct);
        if (response.code === 200) {
          res.json({ status: 'success', message: 'Producto actualizado' });
        } else {
          res.status(response.code).json({ status: 'error', message: response.message });
        }
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar el producto', error: error.message });
      }
    });

    this.productRouter.delete('/:id', async (req, res) => {
      const productId = req.params.id;
    
      try {
        const response = await ProductController.deleteProduct(req, res, productId);
        if (response.message) {
          res.json({ status: 'success', message: 'Producto eliminado' });
        } else {
          res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto', error: error.message });
      }
    });
  }

  getRouter() {
    return this.productRouter;
  }
}

export default new ProductsRouter();
