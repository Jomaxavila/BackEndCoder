import {Router} from "express";
import ProductManager from "/Users/maxi/Desktop/BackEndCoder/src/controllers/productManager.js";

const productRouter = Router()
const productManager = new ProductManager();


productRouter.get("/", async (req, res) => { 
	res.send( await productManager.getProducts())
});
	

productRouter.get("/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	res.send(await productManager.getProductById(id))
});
	

productRouter.post("/", async (req, res) => {
	try {
	const newProduct = req.body;
	const result = await productManager.addProduct(newProduct);
	if (result === "Producto Agregado") {
		res.status(201).send("Producto agregado");
	} else {
		res.status(500).send({ error: "Error al agregar el producto" });
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

productRouter.delete("/:id", async (req, res) => {
	try {
	const id = parseInt(req.params.id);
	await productManager.deleteProductById(id);
	res.status(200).send('Producto eliminado');
	} catch (error) {
	res.status(500).send({ error: error.message });
	}
});

export default productRouter;