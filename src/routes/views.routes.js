import express from "express"
import ProductManager from "../Dao/fileManagers/productManager.js";
import Message from "../Dao/models/messagesModel.js";
import productsModel from "../Dao/models/productModel.js";


const viewRouter = express.Router();
const productManager = new ProductManager();


viewRouter.get("/",async(req, res)=>{
	let allProducts = await productManager.getProducts();
	// console.log(allProducts)
	res.render("home",{
		title: "Lista de productos",
		products: allProducts
	})
})

viewRouter.get("/realtimeproducts",async(req, res)=>{
	let allProducts = await productManager.getProducts();
	// console.log(allProducts)
	res.render('realtimeproducts',{
		title: "Lista de productos en tiempo real",
		products: allProducts
	})
})

viewRouter.get("/chat", async (req, res) => {
	try {
	  const messages = await Message.find({});
	  res.render("chat", { messages }); // Pasar todos los mensajes al template
	} catch (error) {
	  console.log("Error retrieving messages:", error);
	  res.status(500).send("Error retrieving messages");
	}
  });
  
  viewRouter.get("/products", async (req, res) => {
	try {
	  const { page = 1 } = req.query;
	  const {
		docs,
		totalPages,
		prevPage,
		nextPage,
		hasNextPage,
		hasPrevPage,
		prevLink,
		nextLink,
	  } = await productsModel.paginate({}, { limit: 3, page, lean: true });
	  const products = docs;
  
	  res.render("products", {
		products,
		totalPages,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		prevLink,
		nextLink,
	  });
	} catch (error) {
	  res.status(500).send({
		status: "error",
		message: "Error al obtener los productos",
	  });
	}
  });
  
  export default viewRouter;
  
