import express from "express";
import productManager from "./productManager.js"


const app = express();

app.use(express.urlencoded({ extended: true }));

const productos = new productManager();
const readProducts = productos.readProducts();
 
app.get('/products', async (req, res) => {

  // le damos un limite por query y le damos parseInt para que lo tome como numero
  let limit = parseInt(req.query.limit);
  if (!limit) return res.send( await readProducts);
  let allProducts = await readProducts;
  let productLimit = allProducts.slice(0, limit)
  res.send( productLimit);
});
// recibir por params un id
app.get('/products/:id', async (req, res) => {
  let id = parseInt(req.params.id)
  let allProducts = await readProducts;
  let productByid = allProducts.find(product => product.id === id)
  res.send(productByid)
});

app.listen(8080, () => console.log("Servidor arriba en el puerto 8080"));
