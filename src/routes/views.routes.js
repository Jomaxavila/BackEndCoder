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
		products: allProducts,
		user: req.user 
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
	  const { limit = 10, page = 1, sort, query } = req.query;
	  const filters = {};
  
	if (req.query.category) {
	filters.category = req.query.category;
  }
  
  
	  const options = {
		page: parseInt(page),
		limit: parseInt(limit),
		lean: true,
	  };
	  if (sort) {
		options.sort = { price: sort === "asc" ? 1 : -1 };
		
	}else{
		options.sort = { price: sort === "desc" ? 1 : +1 }
	}
  
	  const {
		docs,
		totalPages,
		prevPage,
		nextPage,
		hasNextPage,
		hasPrevPage,
		prevLink,
		nextLink,
	  } = await productsModel.paginate(filters, options);
  
	  res.render("products", {
		products: docs,
		totalPages,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		prevLink: hasPrevPage ? `/products?page=${prevPage}` : null,
		nextLink: hasNextPage ? `/products?page=${nextPage}` : null,
		user: req.session.user,
	  });
	} catch (error) {
	  res.status(500).send({
		status: "error",
		message: "Error al obtener los productos",
	  });
	}
  });


  viewRouter.get('/register', (req,res)=>{
	res.render("register");
  })

  viewRouter.get('/login', (req,res)=>{
	res.render("login");
  })

viewRouter.get('/resetPassword',(req,res)=>{
    res.render('resetPassword');
})

viewRouter.get('/failregister',(req,res)=>{
	res.render('failregister')
})
  
  export default viewRouter;
   
