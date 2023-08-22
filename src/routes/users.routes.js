import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const router = Router();

class UserRouter {
  constructor() {
    this.inicioUser = Router();
    this.userController = UserController; 
    this.inicioUser.get('/', this.userController.getUser);
    this.inicioUser.post('/', this.userController.createUser);
    this.inicioUser.post('/login', this.userController.login.bind(this.userController)); // Corrección aquí
  }

  getRouter() {
    return this.inicioUser;
  }
}

export default new UserRouter();
