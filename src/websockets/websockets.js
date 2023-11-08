import { getDAOS } from "../models/Dao/mongo/indexDAO.js";
import messageModel from "../models/schemas/messagesModel.js";

export default (io) => {
  io.on('connection', (socket) => {


    let messages = [];

    

    socket.on('message', data => {
      messages.push(data);
      io.emit('messagesLogs', messages);
     
      const newMessage = new messageModel({
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
        const { productsDao } = getDAOS(); 
        await productsDao.addProduct(data); 
        const productListUpdated = await productsDao.getProducts();
        io.sockets.emit("refresh-products", productListUpdated);
      } catch (err) {
        console.log(err);
      }
    });
  });
};
