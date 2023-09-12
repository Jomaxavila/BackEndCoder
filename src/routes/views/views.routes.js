import { Router } from "express";
import ViewsController from "../../controllers/views.controller.js";




class ViewsRouter {
  constructor() {
    this.viewsrouter = Router();
    this.viewsrouter.get("/", ViewsController.renderHome);
    this.viewsrouter.get("/chat", ViewsController.renderChat);
    this.viewsrouter.get("/products", ViewsController.renderProducts);
    this.viewsrouter.get('/register', (req, res) => {
      res.render("register");
    });

    this.viewsrouter.get('/login', (req, res) => {
      res.render("login");
    });
    this.viewsrouter.get('/resetPassword', (req, res) => {
      res.render('resetPassword');
    });
    this.viewsrouter.get('/failregister', (req, res) => {
      res.render('failregister');
    });
    this.viewsrouter.get('/cart', (req, res) => {
      res.render('cart');
    });
    this.viewsrouter.get('/admin', ViewsController.renderAdminPage);
  }

  getRouter() {
    return this.viewsrouter;
  }
}

export default new ViewsRouter();