import { Router } from "express";
import ViewsController from "../../controllers/views.controller.js";
import auth from "../../config/auth.middleware.js";


class ViewsRouter {
  constructor() {
    this.viewsrouter = Router();
    this.viewsrouter.get("/", ViewsController.renderHome);
    this.viewsrouter.get("/chat", ViewsController.renderChat);
    this.viewsrouter.get("/products", ViewsController.renderProducts);
    this.viewsrouter.get("/cart", ViewsController.renderCartProducts)
    this.viewsrouter.get('/register', (req, res) => {
      res.render("register");
    });
    this.viewsrouter.get('/login', (req, res) => {
      res.render("login");
    });
    this.viewsrouter.get('/restartPassword', (req, res) => {
      res.render('restartPassword');
    });
    this.viewsrouter.get('/failregister', (req, res) => {
      res.render('failregister');
    });
   
    this.viewsrouter.get('/getviews',auth(["ADMIN"]), ViewsController.renderDeleteUser); 

    this.viewsrouter.get('/admin', auth(["ADMIN", "PREMIUM"]), ViewsController.renderAdminPage);
  }

  getRouter() {
    return this.viewsrouter;
  }
}

export default new ViewsRouter();
