import express from "express";
import productRouter  from '../routes/products.routes.js'
import cartsRouter from '../routes/carts.routes.js'
const app = express ();


app.use(express.json( ));
app.use(express.urlencoded({ extended: true }))
app.use ("/api/products", productRouter)
app.use ("/api/carts", cartsRouter)


app.listen(8080, () => console.log("Servidor arriba en el puerto 8080"));

