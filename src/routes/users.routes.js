import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import SessionController from '../controllers/session.controller.js'; 
import passport from 'passport';

const sessionController = new SessionController();
const router = Router();

class UserRouter {
  constructor() {
    this.inicioUser = Router();
    this.userController = UserController;
    this.sessionController = SessionController; 
    this.inicioUser.get('/', this.userController.getUser);
    this.inicioUser.post('/', this.userController.createUser);
    this.inicioUser.post('/login', passport.authenticate('local'), sessionController.loginUser);
  }

  getRouter() {
    return this.inicioUser;
  }
}

export default new UserRouter();
