import cartModel from "../Dao/models/cartModel.js";

class CartService {
  async createCart() {
    try {
      const cart = await cartModel.create({});
      return {
        code: 202,
        status: "Éxito",
        message: cart,
      };
    } catch (error) {
      return {
        code: 500,
        status: "error",
        message: "Error al crear el carrito",
      };
    }
  }

  async addProductInCart(cartId, productId) {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
      if (!cart) {
        return {
          code: 404,
          status: "error",
          message: "No se encontró un carrito con ese ID",
        };
      }
      
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );

      if (productIndex === -1) {
        cart.products.push({ product: productId, quantity: 1 });
      } else {
        cart.products[productIndex].quantity++;
      }

      await cart.save();

      return {
        code: 202,
        status: "success",
        message: "Producto agregado al carrito",
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteProductInCart(cartId, productId) {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
      if (!cart) {
        return {
          code: 404,
          status: "error",
          message: "No se encontró un carrito con ese ID",
        };
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );

      if (productIndex === -1) {
        return {
          code: 404,
          status: "error",
          message: "El producto no existe en el carrito",
        };
      }

      cart.products.splice(productIndex, 1);

      await cart.save();

      return {
        code: 202,
        status: "success",
        message: "Producto eliminado correctamente del carrito",
      };
    } catch (error) {
      throw error;
    }
  }

  async getCart(cartId) {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
      if (!cart) {
        return {
          code: 404,
          status: "error",
          message: "No se encontró un carrito con ese ID",
        };
      }

      return {
        code: 202,
        status: "Éxito",
        message: cart.products,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCarts() {
    try {
      const carts = await cartModel.find({});
      return {
        code: 202,
        status: "Éxito",
        message: carts,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(cartId) {
    try {
      const deletedCart = await cartModel.findByIdAndDelete(cartId);

      if (!deletedCart) {
        return {
          code: 404,
          status: "error",
          message: "No se encontró un carrito con ese ID",
        };
      }

      return {
        code: 202,
        status: "success",
        message: "Carrito eliminado correctamente",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new CartService();
