import { request, Router } from "express";
import ProductManager from "../Dao/fileManagers/productManager.js";
import ProductManagerMongo from "../Dao/dbManagers/productManagerMongo.js";

const productRouter = Router();
const productManager = new ProductManager();
const productManagerMongo = new ProductManagerMongo();

productRouter.get("/", async (req, res) => { 
	try {
	  const respuesta = await productManagerMongo.getProducts();
	  res.status(respuesta.code).send({
		status: respuesta.status,
		message: respuesta.message
	  });
	} catch (error) {
	  res.status(500).send({
		status: "error",
		message: "Error al obtener los productos"
	  });
	}
  });
  

	productRouter.post('/', async (req,res)=>{
		const product = req.body;
		const respuesta = await productManagerMongo.addProduct(product);
		res.status(respuesta.code).send({
			status:respuesta.status,
			message:respuesta.message
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
    res.status(200).send('Producto actualizado');
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

productRouter.delete('/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const result = await productManager.deleteProductById(productId);
    if (result.message) {
      res.status(200).send('Producto eliminado');
      console.log('Producto eliminado');
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al eliminar el producto');
  }
});

export default productRouter;
