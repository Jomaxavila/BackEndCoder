import CartService from "../services/cart.service.js";
import ProductService from "../services/product.service.js";
import { sendPurchaseConfirmationEmail } from "../services/mailing.js";
import UserService from "../services/users.service.js";


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
        const productIdsInCart = response.productIdsInCart || [];
      

        res.status(response.code).json(response);
    } catch (error) {
        console.error("Error in deleteProductInCart:", error);

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

  async purchaseCart(req, res) {
    try {
      const cartId = req.params.cid;
     
      const cart = await CartService.getCartById(cartId);
      
      if (!cart) {
        console.log("Carrito no encontrado");
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "Carrito no encontrado",
        });
      }
  
      const purchasedQuantities = {};
      const productsNotPurchased = [];
      let cartTotalAmount = 0;
      let cartTotalWithoutStock = 0;
  
      const cartDetails = [];
  
      for (const item of cart.products) {
        const productId = item.product.toString();
        const product = await ProductService.getProductById(productId);
      
        if (!product) {
        
          return res.status(400).json({
            code: 400,
            status: "error",
            message: `Producto con ID ${item.product} no encontrado`,
          });
        }
      
        const purchasedQuantity = item.quantity;
        const productQuantity = product.quantity;
      
        if (productQuantity < purchasedQuantity) {
         
          productsNotPurchased.push(productId);
          const totalForProduct = product.price * purchasedQuantity;
          cartTotalWithoutStock += totalForProduct;
        } else {
     
          purchasedQuantities[productId] = purchasedQuantity;
          const totalForProduct = product.price * purchasedQuantity;
          cartTotalAmount += totalForProduct;
      
          const productDetails = {
            title: product.title,
            description: product.description,
            price: product.price,
            quantity: item.quantity,
          };
          cartDetails.push(productDetails);
        }
      }
      
  
      if (Object.keys(purchasedQuantities).length === 0) {
        return res.status(400).json({
          code: 400,
          status: "error",
          message: "No hay productos con suficiente stock para completar la compra",
        });
      }
  
      
      cart.products = cart.products.filter(
        (item) => productsNotPurchased.includes(item.product.toString())
      );
  
   
      for (const productId of productsNotPurchased) {
        await CartService.removeItemFromCart(cartId, productId);
      }
  
      try {
        await CartService.updateCart(cart);
      } catch (error) {
      }
  
      for (const productId in purchasedQuantities) {
        const product = await ProductService.getProductById(productId);
        product.quantity -= purchasedQuantities[productId];
        await ProductService.updateProducts(product);
        console.log(
          "Stock actualizado para producto con ID",
          productId,
          ":",
          product.quantity
        );
      }
  
  
      await CartService.completeCart(cartId);
      console.log("Carrito marcado como completo:", cartId);
  
      const infoUser = await UserService.getUserEmail(req.session.user.email);
      const nameUser = `${infoUser.first_name} ${infoUser.last_name}`;
      const userCart = infoUser.cart.toString();
  
      const ticketDetails = {
        infoUser,
        cart,
        nameUser,
        userCart,
        cartTotalAmount,
        cartTotalWithoutStock,
        productsNotPurchased,
        cartDetails,
      };
  
  
  
      await sendPurchaseConfirmationEmail(ticketDetails);
  
      res.status(200).json({
        code: 200,
        status: "success",
        message: "Compra exitosa",
        productsNotPurchased,
      });
      
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al finalizar la compra del carrito",
      });
    }
  }

  async updateQuantity(req, res) {
    const { cid } = req.params;
    const { productId, newQuantity } = req.body;

    try {
        const result = await CartService.updateQuantity(cid, productId, newQuantity);

        res.status(result.code).json(result);
    } catch (error) {
        console.error('Error en updateQuantity:', error);
        res.status(500).json({
            code: 500,
            status: 'error',
            message: 'Error al actualizar la cantidad en el carrito',
        });
    }
}


  
  
  
}

export default new CartController();
