import ProductManager from "../controllers/productManager.js";
const path = "./models/productos.json";
const myProductManager = new ProductManager(path);

export default (io) => {

  io.on('connection', socket => {
    console.log("New client websocket: ", socket.id);

    let messages = [];
    io.on ('connection', server=>{
      console.log("Tenemos un cliente nuevo");

      server.on('message', data =>{
        messages.push(data)
        io.emit('messagesLogs',messages)
        console.log(data)
          })

      socket.on('authenticated',data=>{
            socket.broadcast.emit('newUserConnected',data);
        })
    })


    
    socket.on("createProduct", async (data) => {
      console.log(data);
      try {
        await myProductManager.addProduct(data);
        const productListUpdated = await myProductManager.getProducts();
        io.sockets.emit("refresh-products", productListUpdated);
      } catch (err) {
        console.log(err);
      }
    });
  });
};
