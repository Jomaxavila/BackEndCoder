import ViewsService from "../services/views.service.js";
import UserService from "../services/users.service.js"
import SessionService from "../services/session.service.js";


class ViewsController {
  async renderHome(req, res) {
    try {
      const allProducts = await ViewsService.getAllProducts();
      res.render("home", {
        title: "Lista de productos",
        products: allProducts,
      });
    } catch (error) {
      res.status(500).render("error", {
        message: error.message,
      });
    }
  }

  async renderAdminPage(req, res) {
    res.render('admin', { user: req.session.user });
  }

  async renderChat(req, res) {
    try {
      const messages = await ViewsService.getChatMessages();

      res.render("chat", { messages });
    } catch (error) {
      res.status(500).render("error", {
        message: "Error retrieving chat messages",
      });
    }
  }

  async renderProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const filters = {};

      if (req.query.category) {
        filters.category = req.query.category;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true,
      };

      if (sort) {
        options.sort = { price: sort === "asc" ? 1 : -1 };
      } else {
        options.sort = { price: sort === "desc" ? 1 : -1 };
      }
  
      const result = await ViewsService.getProductsWithPagination(filters, options);

      res.render("products", {
        products: result.docs,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
        user: req.session.user,


      });
    } catch (error) {
      res.status(500).render("error", {
        message: "Error al obtener los productos",
      });
    }
  }


async renderCart(req, res) {
  try {
    const userId = req.session.userId; 
    const cartProducts = await ViewsService.getCartUser(userId);
    const user = req.session.user; 

    res.render("cart", { cartProducts, user });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error al obtener los productos del carrito o los datos del usuario",
    });
  }
}


async renderDeleteUser(req, res, next) {
  try {
    const usersResponse = await UserService.getAllUsers();
  
      const sessionResponse = await SessionService.getAllSession();

      const users = usersResponse.message;
      const sessions = sessionResponse.message;

      const usersWithoutSession = users.filter((user) => {
        const session = sessions.find((session) => session.email === user.email);
        return session === undefined; 
      });

      const usersWithNoSessionInfo = usersWithoutSession.map((user) => {
        return {
          ...user,
          mail: user.email,
          // Puedes agregar más información relevante aquí si es necesario
        };
      });
    if (usersResponse.status === 'success') {
      const users = usersWithNoSessionInfo;
      res.render("deleteUser", { users, user: req.session.user });
    } else {
      res.status(500).render("error", {
        message: 'Error al obtener la lista de usuarios',
      });
    }
  } catch (error) {
    next(error);
  }
}

}

export default new ViewsController();
