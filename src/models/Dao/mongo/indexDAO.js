import { CartsDAO} from "./carts/carts.dao.js"
import { OrdersDAO } from "./orders/orders.dao.js";
import { ProductsDAO } from "./products/products.dao.js";
import { UsersDAO } from "./users/users.dao.js";


const cartsDao = new CartsDAO();
const usersDao = new UsersDAO();
const ordersDao = new OrdersDAO();
const productsDao = new ProductsDAO();

export const getDAOS = () => {
  return {
	  cartsDao,
    usersDao,
    ordersDao,
    productsDao,
  }
}
