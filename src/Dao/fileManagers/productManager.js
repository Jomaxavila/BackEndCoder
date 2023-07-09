import { promises as fs } from "fs";

export default class ProductManager {
	constructor() {
		this.path = "../src/db/productos.json"
	}

readProducts = async () => {
	const products = await fs.readFile(this.path, "utf-8");
	return JSON.parse(products);
};

writeProducts = async (products) => {
	await fs.writeFile(this.path, JSON.stringify(products));
};

exist = async (productId) => {
	const products = await this.readProducts();
	return products.some((product) => product.id === productId);
};

addProduct = async (product) => {
	try {
	const productsOld = await this.readProducts();
	const newId =
		productsOld.length > 0
		? Math.max(...productsOld.map((p) => p.id)) + 1
		: 1;
	const newProduct = { ...product, id: newId };
	const productsAll = [...productsOld, newProduct];
	await this.writeProducts(productsAll);
	return "Producto Agregado";
	} catch (error) {
	console.error("Error al agregar el producto:", error.message);
	}
};

getProducts = async () => {
	try {
	return await this.readProducts();
	} catch (error) {
	console.error("Error al obtener los productos:", error.message);
	return [];
	}
};

getProductById = async (id) => {
	try {
	let respuesta3 = await this.readProducts();
	if (!respuesta3.find((product) => product.id === id)) {
		return { message: "Producto no encontrado" };
	} else {
		return respuesta3.find((product) => product.id === id);
	}
	} catch (error) {
	console.error("Error al obtener el producto:", error.message);
	return null;
	}
};

deleteProductById = async (id) => {
	try {
	let respuesta3 = await this.readProducts();
	let productFilter = respuesta3.filter((product) => product.id !== id);
	await fs.writeFile(this.path, JSON.stringify(productFilter));
	return { message: "Producto eliminado" };
	} catch (error) {
	console.error("Error al eliminar el producto:", error.message);
	return { error: "Error al eliminar el producto" };
	}
};

updateProducts = async ({ id, ...producto }) => {
	try {
	await this.deleteProductById(id);
	let productOld = await this.readProducts();
	let productModif = [{ ...producto, id }, ...productOld];
	await fs.writeFile(this.path, JSON.stringify(productModif));
	return { message: "Productos actualizados" };
	} catch (error) {
	console.error("Error al actualizar los productos:", error.message);
	return { error: "Error al actualizar los productos" };
	}
};
};