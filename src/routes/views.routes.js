import { Router } from "express";
import viewsController from "../controllers/views.controller.js";
import addUserToContext from "../middleware/addUsercontex.js";
import auth from "../config/auth.middleware.js";

class ViewsRouter {
  constructor() {
    this.viewsrouter = Router();
    this.viewsrouter.use(addUserToContext);
    this.viewsrouter.get("/", viewsController.renderHome);
    this.viewsrouter.get("/chat", viewsController.renderChat);
    this.viewsrouter.get("/products", viewsController.renderProducts);
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
    this.viewsrouter.get('/admin', viewsController.renderAdminPage);


  }

  getRouter() {
    return this.viewsrouter;
  }
}

export default new ViewsRouter();
