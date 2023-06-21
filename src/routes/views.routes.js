import express from "express"
import ProductManager from "../controllers/productManager.js";


const viewRouter = express.Router();
const productManager = new ProductManager();


viewRouter.get("/realtimeproducts",async(req, res)=>{
	let allProducts = await productManager.getProducts();
	// console.log(allProducts)
	res.render('realtimeproducts',{
		title: "Lista de productos en tiempo real",
		products: allProducts
	})
})

export default viewRouter;