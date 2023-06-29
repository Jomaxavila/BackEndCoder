import { Router } from "express";
import ProductManager from "../controllers/productManager.js";
const path = "src/models/productos.json";
import { validateRequest, validateCodeNotRepeated } from "../middleware/validators.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const productRouter = Router();
const productManager = new ProductManager();

productRouter.use(multer({ storage }).single("thumbnail"));


productRouter.get("/", async (req, res) => { 
	res.send( await productManager.getProducts())
});
	

productRouter.get("/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	res.send(await productManager.getProductById(id))
});
	

productRouter.post("/", validateRequest, validateCodeNotRepeated, async (req, res) => {
	try {
	  const newProduct = req.body;
	  const productCreated = await productManager.addProduct(newProduct);
	  console.log(productCreated);
	  res.redirect("/");
	} catch (err) {
	  res.status(err.status || 500).json({
		status: "error",
		payload: err.message,
	  });
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