import productsModel from "../models/schemas/productModel.js";
import messageModel from "../models/schemas/messagesModel.js";
import cartModel from "../models/schemas/cartModel.js";

class ViewsService {
  async getAllProducts() {
    try {
      const allProducts = await productsModel.find({}, null, {
        lean: true,
      });
      return allProducts;
    } catch (error) {
      throw new Error("Error al obtener los productos");
    }
  }

  async getChatMessages() {
    try {
      const messages = await messageModel.find({});
      return messages;
    } catch (error) {
      throw new Error("Error al obtener los mensajes de chat");
    }
  }

  async getProductsWithPagination(filters, options) {
    try {
      const result = await productsModel.paginate(filters, options);
      return result;
    } catch (error) {
      throw new Error("Error al obtener los productos con paginación");
    }
  }



  async getCartUser(userId) {
  try {
    // Aquí puedes implementar la lógica para obtener el carrito del usuario en función de su ID o desde una sesión.
    const userCart = await cartModel.findOne({ userId }).lean();

    if (!userCart) {
      return []; // Retorna un array vacío si el carrito no se encuentra.
    }

    return userCart.cartItems; // Esto podría ser la información del carrito del usuario.
  } catch (error) {
    throw new Error("Error al obtener el carrito del usuario");
  }
}

}

export default new ViewsService();
