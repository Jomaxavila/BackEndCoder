import CartService from "../services/cart.service.js";
import ProductService from "./product.controller.js";

class CartController {
  async createCart(req, res) {
    try {
      const response = await CartService.createCart();
      if (response.code === 200) {
        res.status(200).json({
          code: 200,
          status: "success",
          message: "Cart created successfully",
          payload: response.message, 
        });
      } else {
        res.status(500).json({
          code: 500,
          status: "error",
          message: "Error creating the cart",
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al crear el carrito",
      });
    }
  }
  
  
  async purchaseCart(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await CartService.getCartById(cartId);
  
      if (!cart) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "Carrito no encontrado",
        });
      }
  
      for (const item of cart.items) {
        const product = await ProductService.getProductById(item.productId);
  
        if (!product) {
          return res.status(400).json({
            code: 400,
            status: "error",
            message: `Producto con ID ${item.productId} no encontrado`,
          });
        }
  
        if (product.stock < item.quantity) {
          return res.status(400).json({
            code: 400,
            status: "error",
            message: `Stock insuficiente para el producto con ID ${item.productId}`,
          });
        }
        product.stock -= item.quantity;
        await ProductService.updateProduct(product);
  
        await CartService.removeItemFromCart(cartId, item.productId);
      }
  
      await CartService.completeCart(cartId);
  
      res.status(200).json({
        code: 200,
        status: "success",
        message: "Compra exitosa",
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al finalizar la compra del carrito",
      });
    }
  }
  
  async addProductInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      
      const response = await CartService.addProductToCart(cartId, productId);
      
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al agregar el producto al carrito",
      });
    }
  }
  
  


  async deleteProductInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const response = await CartService.deleteProductInCart(cartId, productId);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al eliminar el producto del carrito",
      });
    }
  }
 
  
  async getCart(req, res) {
    try {
      const cartId = req.params.id;
      const response = await CartService.getCart(cartId);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al obtener el carrito",
      });
    }
  }

  async getCarts(req, res) {
    try {
      const response = await CartService.getCarts();
      if (response.code === 202) {
        res.status(200).json({
          code: 200,
          status: "success",
          message: "Carts retrieved successfully",
          payload: response.message, 
        });
      } else {
        res.status(500).json({
          code: 500,
          status: "error",
          message: "Error al obtener los carritos",
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al obtener los carritos",
      });
    }
  }
  

  async deleteCart(req, res) {
    try {
      const cartId = req.params.id;
      const response = await CartService.deleteCart(cartId);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al eliminar el carrito",
      });
    }
  }
}

export default new CartController();
