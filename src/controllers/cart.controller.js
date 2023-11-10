import CartService from "../services/cart.service.js";
import ProductService from "../services/product.service.js";
import { sendPurchaseConfirmationEmail } from "../services/mailing.js";
import UserService from "../services/users.service.js"
import ViewsService from "../services/views.service.js";


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

        // Actualiza el carrito antes de marcarlo como completo
        cart.products = cart.products.filter(
            (item) => productsNotPurchased.includes(item.product.toString())
        );

        try {
            await CartService.updateCart(cart);
            console.log('Carrito actualizado antes de la compra:', cart);
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            // Maneja el error de actualización del carrito según sea necesario
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

        const infoUser = await UserService.getUserEmail(req.session.user.email);
        const nameUser = `${infoUser.first_name} ${infoUser.last_name}`;
        const userCart = infoUser.cart.toString();
        const cartProducts = await ViewsService.getCartUser(infoUser.cart);
        const cartTotalAmount = cartProducts.reduce((total, product) => {
            return total + product.product.price * product.quantity;
        }, 0);
        console.log('infoUser:', infoUser);
        console.log('nameUser:', nameUser);
        console.log('userCart:', userCart);
        console.log('cartProducts:', cartProducts);
        console.log('cartTotalAmount:', cartTotalAmount);

        const ticketDetails = {
            infoUser,
            nameUser,
            userCart,
            cartTotalAmount,
        };

        await sendPurchaseConfirmationEmail(ticketDetails);

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
}

export default new CartController();
