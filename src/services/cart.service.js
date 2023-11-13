import cartModel from "../models/schemas/cartModel.js";
import mongoose from "mongoose";


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

        const productIdsInCart = cart.products.map(product => product.product.toString());

        console.log("Product IDs in cart:", productIdsInCart);

        const productIndex = cart.products.findIndex(
            (product) => product.product.equals(productId)
        );

        console.log("Received productId:", productId);
        console.log("Product Index:", productIndex);

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
            productIdsInCart: productIdsInCart, // Agregar la información al objeto de respuesta
        };
    } catch (error) {
        console.error("Error in deleteProductInCart:", error);
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
