import cartModel from "../models/schemas/cartModel.js";

class CartService {
  async createCart() {
    try {
      const cart = await cartModel.create({});
      return {
        code: 200,
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

  async getCartById(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return null; 
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cart) {
    try {
      await cartModel.updateOne({ _id: cart._id }, { $set: cart });
      return { message: "Carrito actualizado" };
    } catch (error) {
      console.error("Error al actualizar el carrito:", error.message);
      return { error: "Error al actualizar el carrito" };
    }
  }

  async removeItemFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
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

  async completeCart(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return {
          code: 404,
          status: "error",
          message: "No se encontró un carrito con ese ID",
        };
      }
      cart.completed = true;

      await cart.save();

      return {
        code: 202,
        status: "success",
        message: "Carrito completado correctamente",
      };
    } catch (error) {
      throw error;
    }
  }
 

  async addProductToCart(cartId, productId) {
    try {
      // Verificar si el carrito existe
      const cart = await cartModel.findOne({ _id: cartId });
      if (!cart) {
        return {
          code: 404,
          status: "error",
          message: "No se encontró un carrito con ese ID",
        };
      }

      // Verificar si el producto ya está en el carrito
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );

      if (productIndex === -1) {
        // Si el producto no está en el carrito, agregarlo
        cart.products.push({ product: productId, quantity: 1 });
      } else {
        // Si el producto ya está en el carrito, incrementar la cantidad
        cart.products[productIndex].quantity++;
      }

      // Guardar el carrito actualizado
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
