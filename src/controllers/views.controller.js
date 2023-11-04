import ViewsService from "../services/views.service.js";
import UserService from "../services/users.service.js"


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

async renderDeleteUser(req, res, next) {
  try {
    const usersResponse = await UserService.getAllUsers();

    if (usersResponse.status === 'success') {
      const users = usersResponse.message;
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
async renderCart(req, res) {
  try {
    // Aquí puedes agregar la lógica para obtener los productos del carrito
    // Por ejemplo, puedes obtener los productos del carrito desde una base de datos o una sesión.
    const cartProducts = await obtenerProductosDelCarrito();

    // Luego, renderiza la vista "cart" y pasa los productos del carrito como datos.
    res.render("cart", { cartProducts });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error al obtener los productos del carrito",
    });
  }
}

  
  
  async deleteUser(req, res) {
    try {
      const userId = req.body.userId; 
  
      res.redirect('/'); 
    } catch (error) {
      res.status(500).render('error', {
        message: 'Error al eliminar el usuario',
      });
    }
  }
  
}

export default new ViewsController();
