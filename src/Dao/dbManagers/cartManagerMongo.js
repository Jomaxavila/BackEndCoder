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


	addProductInCart = async (cid,pid) => {
		const cart = await cartModel.findOne({_id:cid})
		const prodIndex = cart.products.findIndex(cprod => cprod._id ===cid);

		 if (prodIndex === -1 ){
			const product = {
				_id:pid,
				quantity: 1
			}
			cart.products.push(product) 
		 }
		 else{
			let total = cart.products[prodIndex].quantity;
			cart.products[prodIndex].quantity = total +1
		 }
		 const result = await cartModel.updateOne({_id:cid},{$set:cart})
		 return {
			code:202,
			status:'success',
			message:cart.products
		 };
	}

}

export default CartManagerMongo;