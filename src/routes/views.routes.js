import { Router } from "express";
import viewsController from "../controllers/views.controller.js";

class ViewsRouter {
  constructor() {
    this.viewsrouter = Router();
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
  }

  getRouter() {
    return this.viewsrouter;
  }
}

export default new ViewsRouter();
