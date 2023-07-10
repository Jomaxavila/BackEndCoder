import express from "express"
import ProductManager from "../Dao/fileManagers/productManager.js";
import Message from "../Dao/models/messagesModel.js";


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
	  res.render("chat", { messages });
	} catch (error) {
	  console.log("Error retrieving messages:", error);
	  res.status(500).send("Error retrieving messages");
	}
  });
  


export default viewRouter;