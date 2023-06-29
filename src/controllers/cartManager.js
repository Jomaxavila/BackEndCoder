import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./productManager.js";

const productsAll = new ProductManager

class CartManager {
	constructor(){
		this.path = "../models/carts.json"
	} 

	readCarts = async () => {
		let carts = await fs.readFile(this.path, "utf-8");
		return JSON.parse(carts);
	};
	
	writeCarts = async (cart) => {
		await fs.writeFile(this.path, JSON.stringify(cart));
	};
	addCarts = async () => {
		let cartsOld = await this.readCarts();
		let id = nanoid();
		if (!Array.isArray(cartsOld)) {
			cartsOld = [];
		}
		let cartsConcat = [{ id: id, products: [] }, ...cartsOld];
		await this.writeCarts(cartsConcat);
		return "Carrito agregado";
};

	exist = async (id) => {
		let carts = await this.readCarts();
		return carts.find(carts => carts.id === id)
	}

	getCartsById = async (id) => {
		try {
		const carts = await this.readCarts();
		const cart = carts.find((cart) => cart.id === id);
		if (!cart) {
			return { message: "Carrito no encontrado" };
		} else {
			return cart;
		}
		} catch (error) {
		console.error("Error al obtener el carrito:", error.message);
		return null;
		}
	};

	addProductInCart = async (cartId, productId) => {
		let cartById = await this.exist(cartId);
		if (!cartById) return "Carrito No Encontrado";

		let cartsAll = await this.readCarts();
		let cartIndex = cartsAll.findIndex((cart) => cart.id === cartId);
	
		let productById = await productsAll.getProductById(productId);
		if (!productById) return "Producto No Encontrado";
	
		let existingProduct = cartById.products.find((prod) => prod.id === productId);
		if (existingProduct) {
		existingProduct.cantidad++;
		} else {
		cartById.products.push({ id: productId, cantidad: 1 });
		}
		cartsAll[cartIndex] = cartById;
		await this.writeCarts(cartsAll); 
	
		if (existingProduct) {
		return "Producto sumado al Carrito";
		} else {
		return "Producto Agregado al Carrito";
		}
	};
	
}

	export default CartManager;