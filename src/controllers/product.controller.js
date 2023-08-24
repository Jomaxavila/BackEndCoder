import ProductService from "../services/product.service.js";


class ProductController {

  async getAllProducts(req, res) {
    try {
      const result = await ProductService.getProducts();
      res.status(result.code).json({
        status: result.status,
        payload: result.message,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los productos",
      });
    }
  }
  
  async getProducts(req, res) {
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

      const response = await productService.getProducts(filters, options);
      const totalProducts = await productService.countProducts(filters);
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
      res.status(500).json({
        status: "error",
        message: "Error al obtener los productos",
      });
    }
  }

  async createProduct(req, res) {
    try {
      const product = req.body;
      const response = await productService.addProduct(product);
      res.status(response.code).json({
        status: response.status,
        message: response.message,
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al crear el producto",
      });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const response = await productService.getProductById(productId);
      if (response) {
        res.send(response);
      } else {
        res.status(404).send({ message: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const updatedProduct = req.body;
      await productService.updateProducts({ id: productId, ...updatedProduct });
      res.status(200).send("Producto actualizado");
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const result = await productService.deleteProductById(productId);
      if (result.message) {
        res.status(200).send("Producto eliminado");
        console.log("Producto eliminado");
      } else {
        res.status(404).send("Producto no encontrado");
      }
    } catch (error) {
      res.status(500).send("Error al eliminar el producto");
    }
  }
}
    
export default ProductController;