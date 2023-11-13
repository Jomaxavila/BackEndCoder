import ProductService from "../services/product.service.js";

 class ProductController {

  static async getAllProducts(req, res, next) {
    try {
      const result = await ProductService.getProducts();
      return result; 
    } catch (error) {
      next(error);
    }
  }
  
  static async getProducts(req, res, next) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;

      const options = {};
      const filters = {};

      options.limit = parseInt(limit);
      const skip = (parseInt(page) - 1) * options.limit;
      options.skip = skip;

      if (sort === "asc") {
        options.sort = { price: 1 };
      } else if (sort === "desc") {
        options.sort = { price: -1 };
      }

      if (query) {
        filters.category = query;
      }

      const response = await ProductService.getProducts(filters, options);
      const totalProducts = await ProductService.countProducts(filters);
      const totalPages = Math.ceil(totalProducts / options.limit);

      response.totalPages = totalPages;
      response.prevPage = page > 1 ? parseInt(page) - 1 : null;
      response.nextPage = page < totalPages ? parseInt(page) + 1 : null;
      response.page = parseInt(page);
      response.hasPrevPage = page > 1;
      response.hasNextPage = page < totalPages;

      response.prevLink =
        page > 1
          ? `${req.baseUrl}?limit=${limit}&page=${parseInt(page) - 1}&sort=${sort}&query=${query}`
          : null;
      response.nextLink =
        page < totalPages
          ? `${req.baseUrl}?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort}&query=${query}`
          : null;

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, newProduct) {
    try {
      const response = await ProductService.addProduct(newProduct);

      return response;
    } catch (error) {
      return {
        code: 500,
        status: 'error',
        message: error.message,
      };
    }
  }


  static async getProductById(req, res, next) {
    try {
      const productId = req.params.id;
      const response = await ProductService.getProductById(productId);

      if (response && response.message) {
        res.status(404).json({
          status: 'error',
          message: 'Producto no encontrado',
        });
      } else {
        res.status(200).json({
          status: 'success',
          payload: response,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const updatedProduct = req.body;
      await ProductService.updateProducts({ id: productId, ...updatedProduct });
      res.status(200).send("Producto actualizado");
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const result = await ProductService.deleteProductById(productId);
      if (result.message) {
        res.status(200).send("Producto eliminado");
        console.log("Producto eliminado");
      } else {
        res.status(404).send("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error en el controlador al eliminar el producto:", error.message);
      next(error);  
    }
  }
  
}

export default ProductController; 