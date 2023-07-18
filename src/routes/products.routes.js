import { request, Router } from "express";
import ProductManager from "../Dao/fileManagers/productManager.js";
import ProductManagerMongo from "../Dao/dbManagers/productManagerMongo.js";

const productRouter = Router();
const productManager = new ProductManager();
const productManagerMongo = new ProductManagerMongo();

productRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Aplicar los filtros y opciones según los parámetros recibidos
    const options = {};
    const filters = {};

    // Aplicar el límite de resultados por página
    options.limit = parseInt(limit);

    // Calcular el número de elementos a saltar según la página solicitada
    const skip = (parseInt(page) - 1) * options.limit;
    options.skip = skip;

    // Aplicar el ordenamiento según el parámetro sort
    if (sort === "asc") {
      options.sort = { price: 1 };
    } else if (sort === "desc") {
      options.sort = { price: -1 };
    }

    // Aplicar el filtro según el parámetro query
    if (query) {
      filters.category = query;
    }

    // Obtener los productos según los filtros y opciones
    const products = await productManagerMongo.getProducts(filters, options);

    // Obtener el número total de páginas
    const totalProducts = await productManagerMongo.countProducts(filters);
    const totalPages = Math.ceil(totalProducts / options.limit);

    // Construir el objeto de respuesta
    const response = {
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? parseInt(page) - 1 : null,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1
          ? `${req.baseUrl}?limit=${limit}&page=${
              parseInt(page) - 1
            }&sort=${sort}&query=${query}`
          : null,
      nextLink:
        page < totalPages
          ? `${req.baseUrl}?limit=${limit}&page=${
              parseInt(page) + 1
            }&sort=${sort}&query=${query}`
          : null,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener los productos",
    });
  }
});

productRouter.post("/", async (req, res) => {
  const product = req.body;
  const respuesta = await productManagerMongo.addProduct(product);
  res.status(respuesta.code).send({
    status: respuesta.status,
    message: respuesta.message,
  });
});

productRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await productManagerMongo.getProductById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedProduct = { id, ...req.body };
    await productManager.updateProducts(updatedProduct);
    res.status(200).send("Producto actualizado");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

productRouter.delete("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const result = await productManager.deleteProductById(productId);
    if (result.message) {
      res.status(200).send("Producto eliminado");
      console.log("Producto eliminado");
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar el producto");
  }
});

export default productRouter;
