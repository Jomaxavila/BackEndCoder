import { response, Router } from "express";
import CartManagerMongo from "../Dao/dbManagers/cartManagerMongo.js";

const cartRouter = Router();
const cartManagerMongo = new CartManagerMongo();

cartRouter.post('/', async (req, res) => {
  const respuesta = await cartManagerMongo.createCart();   
  res.status(200).send({
    status: respuesta.status,
    message: respuesta.message
  });
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
	let cartId = req.params.cid;
	let productId = req.params.pid;
	const respuesta = await cartManagerMongo.addProductInCart(cartId, productId);
	res.status(respuesta.code).send({
	  status: respuesta.status,
	  message: respuesta.message
	});
  })

  cartRouter.delete('/:cid/products/:pid', async (req, res) => {
	try {
	  const cartId = req.params.cid;
	  const productId = req.params.pid;
	
	  const respuesta = await cartManagerMongo.deleteProductInCart(cartId, productId);
	
	  res.status(respuesta.code).send({
		status: respuesta.status,
		message: respuesta.message,
	  });
	} catch (error) {
	  console.error('Error al eliminar el producto del carrito:', error.message);
	  res.status(500).json({
		status: 'error',
		message: 'Error al eliminar el producto del carrito',
	  });
	}
  });
  
  
  cartRouter.put('/:cid/products/:pid', async (req, res) => {
	try {
	  const cartId = req.params.cid;
	  const productId = req.params.pid;
	  const quantity = req.body.quantity;
  
	  const updatedCart = await cartManagerMongo.updateProductQuantity(cartId, productId, quantity);
  
	  // Verificar si el carrito y el producto existen en el objeto updatedCart
	  if (!updatedCart || !updatedCart.products) {
		return res.status(404).json({ message: 'Carrito no encontrado' });
	  }
	  
	  // Encontrar el producto en el carrito
	  const product = updatedCart.products.find((prod) => prod._id === productId); 
  
	  // Verificar si el producto existe en el carrito
	  if (!product) {
		return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
	  }
  
	  product.quantity = quantity;
  
	  res.status(200).json({
		status: 'success',
		message: 'Cantidad de producto actualizada correctamente',
		cart: updatedCart,
	  });
	} catch (error) {
	  res.status(500).json({ message: 'Error al actualizar la cantidad de producto en el carrito' });
	}
  });
  


cartRouter.get('/', async (req, res) => {
	res.send(await cartManagerMongo.getCarts());
});

cartRouter.get('/:id', async (req, res) => {
  const cart = await cartManagerMongo.getCart(req.params.id);
  res.send({
    status: "success",
    message: JSON.parse(JSON.stringify(cart, null, "\t")),
  });
});


cartRouter.delete('/:id', async (req, res) => {
	const cartId = req.params.id;
	const respuesta = await cartManagerMongo.deleteCart(cartId);
	res.status(respuesta.code).send({
	  status: respuesta.status,
	  message: respuesta.message
	});
  });
  

export default cartRouter;
