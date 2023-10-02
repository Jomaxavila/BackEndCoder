import { Router } from 'express';
import UserController from "../../controllers/user.controller.js"
import SessionController from "../../controllers/session.controller.js"

class UserRouter {
  constructor() {
    this.router = Router();
    this.router.get('/', UserController.getUser);
    this.router.post('/', UserController.createUser);
    this.router.post('/login', SessionController.loginUser);
    this.router.put('/premium', UserController.changeUserRole);

  }

  getRouter() {
    return this.router;
  }
}

export default new UserRouter();
