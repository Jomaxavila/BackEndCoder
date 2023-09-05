import { HttpError, HTTP_STATUS } from "../utilidades/response.js"
import { getDAOS } from "../models/Dao/mongo/indexDAO.js";

const { ticketsDao, productsDao, usersDao } = getDAOS();

export default class TicketService {
  async getTickets() {
    try {
      const tickets = await ticketsDao.getTickets();
      return tickets;
    } catch (error) {
      throw new HttpError("Error al obtener los tickets");
    }
  }

  async getTicketById(id) {
    if (!id) {
      throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
    }
    const ticket = await ticketsDao.getTicketById(id);
    if (!ticket) {
      throw new HttpError('Ticket not found', HTTP_STATUS.NOT_FOUND);
    }
    return ticket;
  }

  async createTicket(payload) {
    const { user, products } = payload;
    const userDB = await usersDao.getUserById(user);
    if (!userDB) {
      throw new HttpError('`user` is a required field', HTTP_STATUS.BAD_REQUEST);
    }

    if (!products || !Array.isArray(products) || !products.length) {
      throw new HttpError('Products array not valid', HTTP_STATUS.BAD_REQUEST);
    }

    try {
    
      for (const productInfo of products) {
        const product = await productsDao.getProductById(productInfo.productId);

        if (!product) {
          throw new HttpError(`Producto con ID ${productInfo.productId} no encontrado`);
        }

        if (product.stock < productInfo.quantity) {
          throw new HttpError(`Stock insuficiente para el producto con ID ${productInfo.productId}`);
        }
      }
      const createdTicket = await ticketsDao.createTicket({ user, products });

      for (const productInfo of products) {
        const product = await productsDao.getProductById(productInfo.productId);

     
        product.stock -= productInfo.quantity;
        await productsDao.updateProduct(product._id, product);
      }

      return createdTicket;
    } catch (error) {
      throw error;
    }
  }

  async resolveTicket(id, ticketData) {
    if (!id || !ticketData) {
      throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
    }

    try {
     
      const updatedTicket = await ticketsDao.updateTicket(id, ticketData);
      if (updatedTicket.nModified === 0) {
        return null;
      }
      return updatedTicket;
    } catch (error) {
      throw new HttpError("Error al resolver el ticket");
    }
  }
}
