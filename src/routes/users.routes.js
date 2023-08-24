import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import SessionController from '../controllers/session.controller.js'; 
import passport from 'passport';


const router = Router();

class UserRouter {
  constructor() {
    this.inicioUser = Router();
    this.sessionController = SessionController; // No necesitas crear una instancia aquí
    this.inicioUser.get('/', UserController.getUser);
    this.inicioUser.post('/', UserController.createUser);
    this.inicioUser.post('/login', passport.authenticate('local'), SessionController.loginUser);
  }

  getRouter() {
    return this.inicioUser;
  }
}

export default new UserRouter();
