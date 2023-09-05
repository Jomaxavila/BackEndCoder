import CartsDAO from "./carts/carts.dao.js"
import ProductsDAO  from "./products/products.dao.js";
import UsersDAO  from "./users/users.dao.js";
import TicketsDAO from "./ticket/tickets.dao.js"

const cartsDao = new CartsDAO();
const usersDao = new UsersDAO();
const productsDao = new ProductsDAO();
const ticketsDao = new TicketsDAO()

export const getDAOS = () => {
  return {
	  cartsDao,
    usersDao,
    ticketsDao,
    productsDao,
  }
}
