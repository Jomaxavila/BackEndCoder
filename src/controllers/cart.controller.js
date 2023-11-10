import CartService from "../services/cart.service.js";
import ProductService from "../services/product.service.js";


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
        console.log('Cart ID:', cartId);
        const cart = await CartService.getCartById(cartId);
        console.log('Cart encontrado:', cart);

        if (!cart) {
            console.log('Carrito no encontrado');
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Carrito no encontrado",
            });
        }

        const purchasedQuantities = {};
        const productsNotPurchased = [];

        for (const item of cart.products) {
            const productId = item.product.toString();
            const product = await ProductService.getProductById(productId);

            if (!product) {
                console.log(`Producto con ID ${item.product} no encontrado`);
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: `Producto con ID ${item.product} no encontrado`,
                });
            }

            const purchasedQuantity = item.quantity;
            const productQuantity = product.quantity;

            if (productQuantity < purchasedQuantity) {
                console.log(`Stock insuficiente para el producto con ID ${item.product}`);
                productsNotPurchased.push(productId);
            } else {
                purchasedQuantities[productId] = purchasedQuantity;
                console.log("Cantidad comprada de producto con ID", productId, ":", purchasedQuantity);
            }
        }

        if (Object.keys(purchasedQuantities).length === 0) {
            // No hay productos con suficiente stock para comprar
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "No hay productos con suficiente stock para completar la compra",
            });
        }

        for (const productId in purchasedQuantities) {
            const product = await ProductService.getProductById(productId);
            product.quantity -= purchasedQuantities[productId];
            await ProductService.updateProducts(product);
            console.log("Stock actualizado para producto con ID", productId, ":", product.quantity);
        }

        console.log("Productos que no se pudieron comprar:", productsNotPurchased);

        await CartService.completeCart(cartId);
        console.log('Carrito marcado como completo:', cartId);

        // Elimina los productos comprados del carrito
        cart.products = cart.products.filter(
            (item) => productsNotPurchased.includes(item.product.toString())
        );

        await CartService.updateCart(cart);

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Compra exitosa",
            productsNotPurchased,
        });
    } catch (error) {
        console.log('Error:', error);
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
