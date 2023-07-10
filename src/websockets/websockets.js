import ProductManager from "../Dao/fileManagers/productManager.js";
import Message from "../Dao/models/messagesModel.js";

const path = "src/models/productos.json";
const myProductManager = new ProductManager(path);

export default (io) => {
  io.on('connection', (socket) => {
    console.log("New client websocket: ", socket.id);

    let messages = [];

    console.log("Tenemos un cliente nuevo");

    socket.on('message', data => {
      messages.push(data);
      io.emit('messagesLogs', messages);
      console.log(data);

      // Guardar el mensaje en la colección "messages"
      const newMessage = new Message({
        user: data.user,
        message: data.message,
      });
      newMessage.save()
        .then(() => {
          console.log('Mensaje guardado en MongoDB');
        })
        .catch(error => {
          console.error('Error al guardar el mensaje en MongoDB:', error);
        });
    });

    socket.on('authenticated', data => {
      socket.broadcast.emit('newUserConnected', data);
    });

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
