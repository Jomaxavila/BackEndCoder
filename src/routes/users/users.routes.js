import { Router } from 'express';
import UserController from "../../controllers/user.controller.js"
import SessionController from "../../controllers/session.controller.js"
import upload from '../../utils.js';

class UserRouter {
  constructor() {
    this.router = Router();
    this.router.get('/', UserController.getUser);
    this.router.post('/', UserController.createUser);
    this.router.post('/login', SessionController.loginUser);
    this.router.put('/premium/:uid', UserController.changeToPremium);
    this.router.post('/:uid/documents', upload.fields([
      { name: 'profileImage', maxCount: 1 },
      { name: 'productImage', maxCount: 1 },
      { name: 'documents', maxCount: 1 },
    ]), UserController.uploadDocuments);
  }
  getRouter() {
    return this.router;
  }
}

export default new UserRouter();
