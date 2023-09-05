import CartService from "../services/cart.service.js";

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

  async addProductInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const response = await CartService.addProductInCart(cartId, productId);
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
      const response = await CartService.purchaseCart(cartId);
      res.status(response.code).json(response);
    } catch (error) {
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
