import ProductsDAO from "../models/Dao/mongo/products/products.dao.js";
import productService from "../services/product.service.js";



export default class TicketsController {
  static async getTickets(req, res, next) {
    try {
      // Obtiene todos los tickets
      const tickets = await TicketsService.getTickets();
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  }

  static async getTicketById(req, res, next) {
    const { id } = req.params;
    try {
      // Obtiene un ticket por su ID
      const ticket = await TicketsService.getTicketById(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket no encontrado" });
      }
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  }

  static async createTicket(req, res, next) {
    const ticketData = req.body;

    try {
      // Verifica el stock de los productos en el carrito antes de crear el ticket
      for (const productInfo of ticketData.products) {
        const product = await TicketsService.getProductById(productInfo.productId);

        if (!product) {
          return res.status(400).json({ message: `Producto con ID ${productInfo.productId} no encontrado` });
        }

        if (product.stock < productInfo.quantity) {
          return res.status(400).json({ message: `Stock insuficiente para el producto con ID ${productInfo.productId}` });
        }
      }

      // Si todos los productos tienen suficiente stock, crea el ticket
      const createdTicket = await TicketsService.createTicket(ticketData);

      // Actualiza el stock de los productos en el carrito
      for (const productInfo of ticketData.products) {
        const product = await productService.getProductById(productInfo.productId);

        // Resta la cantidad del producto del stock
        product.stock -= productInfo.quantity;
        await ProductsDAO.updateProduct(product._id, product);
      }

      res.status(201).json(createdTicket);
    } catch (error) {
      next(error);
    }
  }

  static async resolveTicket(req, res, next) {
    const { id } = req.params;
    const ticketData = req.body;
    try {
      // Actualiza un ticket por su ID
      const updatedTicket = await TicketsService.updateTicket(id, ticketData);
      if (updatedTicket.nModified === 0) {
        return res.status(404).json({ message: "Ticket no encontrado" });
      }
      res.json(updatedTicket);
    } catch (error) {
      next(error);
    }
  }
  static async createTicket(req, res, next) {
    const ticketData = req.body;
    
    try {
      // Crea un nuevo ticket
      const createdTicket = await TicketsService.createTicket(ticketData);

      // Verifica el stock de los productos en el carrito
      for (const productInfo of ticketData.products) {
        const product = await ProductsDAO.getProductById(productInfo.productId);

        if (!product) {
          return res.status(400).json({ message: `Producto con ID ${productInfo.productId} no encontrado` });
        }

        if (product.stock < productInfo.quantity) {
          return res.status(400).json({ message: `Stock insuficiente para el producto con ID ${productInfo.productId}` });
        }

        // Resta la cantidad del producto del stock
        product.stock -= productInfo.quantity;
        await ProductsDAO.updateProduct(product._id, product);
      }

      res.status(201).json(createdTicket);
    } catch (error) {
      next(error);
    }
  }
}