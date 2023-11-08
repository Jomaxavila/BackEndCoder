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



  async getCartUser(cartId) {
    try {
      const userCart = await cartModel.findOne({ _id: cartId })
     
        .populate({
          path: "products.product",
          model: "products",
        })
        .lean();
  
      if (!userCart) {
        return [];
      }
      console.log("userCart de VIEWS SERVICE ", userCart.toString())
      return userCart.products;
    } catch (error) {
      throw new Error("Error al obtener el carrito del usuario");
    }
  }
  
  
  

}

export default new ViewsService();
