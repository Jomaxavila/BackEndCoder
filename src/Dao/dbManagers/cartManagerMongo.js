import cartModel from "../models/cartModel.js";

class CartManagerMongo {
	constructor(){
		this.path = "./src/db/carts.json"
	} 

	createCart = async () => {
		let cart = await cartModel.create({})
		return {
			code: 202,
			status: 'Éxito',
			message: cart
		};
	};
	
	getCart = async (cartId) => {
		const cart = await cartModel.findOne({ _id: cartId });
		if (!cart) {
			return {
				code: 400,
				status: 'error',
				message: "No se encontró un carrito con ese ID"
			};
		}
		return {
			code: 202,
			status: 'Éxito',
			message: cart.products
		};
	};
	  
	getCarts = async () => {
		const carts = await cartModel.find({});
		return {
			code: 202,
			status: 'Éxito',
			message: carts
		};
	};


	deleteProductInCart = async (cid, pid) => {
		try {
		  const cart = await cartModel.findOne({ _id: cid });
		
		  if (!cart) {
			return {
			  code: 404,
			  status: 'error',
			  message: 'El carrito no existe',
			};
		  }
		
		  const productIndex = cart.products.findIndex((product) => product._id.toString() === pid.toString());
		
		  if (productIndex === -1) {
			return {
			  code: 404,
			  status: 'error',
			  message: 'El producto no existe en el carrito',
			};
		  }
		
		  cart.products.splice(productIndex, 1);
		
		  await cart.save();
		
		  return {
			code: 202,
			status: 'success',
			message: 'Producto eliminado correctamente del carrito',
			cart: cart,
		  };
		} catch (error) {
		  console.error('Error al eliminar el producto del carrito:', error.message);
		  return {
			code: 500,
			status: 'error',
			message: 'Error al eliminar el producto del carrito',
		  };
		}
	  };
	  


	  addProductInCart = async (cid, pid) => {
		try {
		  const cart = await cartModel.findOne({ _id: cid });
		  if (!cart) {
			return {
			  code: 404,
			  status: 'error',
			  message: 'No se encontró un carrito con ese ID',
			};
		  }
	  
		  const productIndex = cart.products.findIndex((product) => product.product.toString() === pid);
		  if (productIndex === -1) {
			cart.products.push({ product: pid, quantity: 1 });
		  } else {
			cart.products[productIndex].quantity++;
		  }
	  
		  await cart.save();
	  
		  return {
			code: 202,
			status: 'success',
			message: 'Producto agregado al carrito',
		  };
		} catch (error) {
		  console.error('Error al agregar el producto al carrito:', error.message);
		  throw error;
		}
	  };
	  
	  
	// Eliminar carrito
	deleteCart = async (cartId) => {
		try {
			const deletedCart = await cartModel.findByIdAndDelete(cartId);
	  
			if (!deletedCart) {
				return {
					code: 404,
					status: 'error',
					message: 'No se encontró un carrito con ese ID',
				};
			}
	  
			return {
				code: 202,
				status: 'success',
				message: 'Carrito eliminado correctamente',
			};
		} catch (error) {
			console.error('Error al eliminar el carrito:', error.message);
			throw error;
		}
	};
}

export default CartManagerMongo;
