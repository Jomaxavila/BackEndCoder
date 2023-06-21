import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import productRouter  from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import path from "path";
import viewRouter from "./routes/views.routes.js";
import { Server } from "socket.io";
import ProductManager from "./controllers/productManager.js";

const app = express();
const httpserver = app.listen(8080, () => console.log("Servidor arriba en el puerto 8080"));
const socketServer = new Server(httpserver);
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

// static
app.use('/', express.static(__dirname + "/public"));
app.use('/', viewRouter);

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", viewRouter);

socketServer.on('connection', socket => {
  console.log("Nuevo Cliente");

  
  socket.on('createProduct', async newProduct => {
    try {
      const result = await productManager.addProduct(newProduct);
      if (result === "Producto Agregado") {
        const createdProduct = await productManager.getProductById(newProduct.id); 
        console.log("nuevo producto agregado a la lista")
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }

  });
});

export default app;
