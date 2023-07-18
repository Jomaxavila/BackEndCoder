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
	  const { limit = 10, page = 1, sort, query } = req.query;
  
	  // Construye el objeto de filtros para la consulta
	  const filters = {};
  
		//filtrado por categorias modernas / antiguas/ clasicas
	if (req.query.category) {
	filters.category = req.query.category; // ejemplo: http://localhost:8080/products/?category=modernas
  }
  
  
	  const options = {
		page: parseInt(page),
		limit: parseInt(limit), // ejemplo : http://localhost:8080/products/?limit=1
		lean: true,
	  };
	  
	  // Agrega el ordenamiento si está presente
	  if (sort) {
		options.sort = { price: sort === "asc" ? 1 : -1 }; // ejemplo : http://localhost:8080/products/?sort=asc
		
	}else{
		options.sort = { price: sort === "desc" ? 1 : +1 } // ejemplo : http://localhost:8080/products/?sort=desc
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
	  });
	} catch (error) {
	  res.status(500).send({
		status: "error",
		message: "Error al obtener los productos",
	  });
	}
  });
  
  export default viewRouter;
  
