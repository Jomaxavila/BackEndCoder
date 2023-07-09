import { Router } from "express";
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
	res.send(await cartManagerMongo.addProductInCart(cartId, productId));
});


cartRouter.get('/', async (req, res) => {
	res.send(await cartManagerMongo.getCarts());
});

cartRouter.get('/:id', async (req, res) => {
	res.send(await cartManagerMongo.getCart(req.params.id));
});
 

export default cartRouter;
