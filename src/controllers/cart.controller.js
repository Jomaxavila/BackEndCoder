import CartService from "../services/cart.service.js";
import ProductService from "./product.controller.js";

class CartController {
  async createCart(req, res) {
    try {
      const response = await CartService.createCart();
      res.status(response.code).json(response);
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
  
        // Descuenta la cantidad comprada del stock y actualiza la base de datos
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
      
      // Llamar a la función de CartService para agregar el producto al carrito
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
  async purchaseCart(req, res) {
    try {
      const cartId = req.params.cid;
      console.log(`Inicio de la compra del carrito ${cartId}`);
  
      const cart = await CartService.getCartById(cartId);
      console.log(`Carrito obtenido: ${JSON.stringify(cart)}`);
  
      // Iterar sobre las propiedades del objeto cart.items
      for (const productId in cart.items) {
        const quantity = cart.items[productId];
  
        const product = await ProductService.getProductById(productId);
  
        if (!product) {
          return res.status(400).json({
            code: 400,
            status: "error",
            message: `Producto con ID ${productId} no encontrado`,
          });
        }
  
        if (product.stock < quantity) {
          return res.status(400).json({
            code: 400,
            status: "error",
            message: `Stock insuficiente para el producto con ID ${productId}`,
          });
        }
  
        product.stock -= quantity;
        await ProductService.updateProduct(product);

      }
  
      await CartService.completeCart(cartId);
  
      res.status(200).json({
        code: 200,
        status: "success",
        message: "Compra exitosa",
      });
    } catch (error) {
      console.error(`Error en la compra del carrito: ${error.message}`);
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al finalizar la compra del carrito",
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
      res.status(response.code).json(response);
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
